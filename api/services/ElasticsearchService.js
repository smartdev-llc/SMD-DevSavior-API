const elasticsearch = require("elasticsearch");
const Promise = require("bluebird");
const indexName = process.env.ES_INDEX_NAME || "juniorviec";
const connectionConfig = {
  host: process.env.ES_HOST || "127.0.0.1:9200",
  // log: process.env.ES_LOG_LEVEL || 'trace'
};

let es = new elasticsearch.Client(connectionConfig);
const esClient = Promise.promisifyAll(es, { context: es });

module.exports = {

  create: async function (options) {
    return await esClient.create(
      _.extend({
        index: indexName
      },
        _.pick(options, ["type", "id", "body"])
      )
    );
  },
  update: async function (options) {
    return await esClient.update(
      _.extend({
        index: indexName
      },
        _.pick(options, ["type", "id",  "body"])
      )
    );
  },

  updateByQuery: async function (options) {
    return await esClient.update(
      _.extend({
        index: indexName
      },
        _.pick(options, ["type",  "body"])
      )
    );
  },

  delete: async function (options) {
    return await esClient.delete(
      _.extend({
        index: indexName
      },
        _.pick(options, ["type", "id"])
      )
    );
  },

  search: async function (params) {
    return await esClient.search(
      _.extend({
        index: indexName
      },
        _.pick(params, ["type", "body"])
      )
    );
  },

  buildQuery: (params) => {
    return {
      activeJob: () => ({
        "term": {
          "status": "ACTIVE"
        }
      }),
      identifiers: (options) => {
        let mustList = [];
        if (options.nestedIdNames) {
          mustList = mustList.concat(options.nestedIdNames.reduce((arr, item) => {
            if (params[item.request]) {
              arr.push({
                nested: {
                  path: item.path,
                  query: {
                    term: {
                      [item.field]: params[item.request]
                    }
                  }
                }
              });
            }
            return arr;
          }, []));
        }
        if (options.idNames) {
          mustList = mustList.concat(options.idNames.reduce((arr, item) => {
            if (params[item.request]) {
              arr.push({
                term: {
                  [item.field]: params[item.request]
                }
              });
            }
            return arr;
          }, []));
        }
        return mustList;
      },
      multiChoices: (options) => {
        let valueArr = _.compact([].concat(params[options.request]));
        if (!_.isEmpty(valueArr)) {
          if (options.type === "nested") {
            return {
              nested: {
                path: options.path,
                query: {
                  terms: {
                    [options.field]: valueArr
                  }
                }
              }
            };
          }
          return {
            terms: {
              [options.field]: valueArr
            }
          };
        }
      },
      textSearch: ({ text, options }) => {
        let tokens = [].concat(text);
        let shouldArr = tokens.reduce((aggsArr, token) => {
          aggsArr = aggsArr.concat((options.keys || []).reduce((ls, key) => ls.concat([{
            wildcard: {
              [key]: `*${_.toLower(token)}*`
            }
          }, {
            match: {
              [key]: `*${_.toLower(token)}*`
            }
          }]), []));
          return aggsArr.concat((options.nestedKeys || []).map(key => ({
            nested: {
              path: key.split(".").shift(),
              query: {
                bool: {
                  should: [{
                    wildcard: {
                      [key]: `*${_.toLower(token)}*`
                    }
                  }, {
                    match: {
                      [key]: `*${_.toLower(token)}*`
                    }
                  }]
                }
              }
            }
          })));
        }, []);

        return {
          bool: {
            should: shouldArr
          }
        };
      }
    };
  },

  transformResult: (options) => {
    return {
      getHits: (result) => {
        return {
          total: result.hits.total,
          list: result.hits.hits.map(hit => _.extend(hit._source, { id: hit._id, _id: hit._id }))
        };
      }
    };
  }
};
