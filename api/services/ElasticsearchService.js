const elasticsearch = require('elasticsearch');
const lodash = _;
const config = sails.config.custom.elasticsearch;
const indexName = config.indexName;
const Promise = require('bluebird');

let es = new elasticsearch.Client(config.connection);
const esClient = Promise.promisifyAll(es, { context: es });

module.exports = {

  create: async function (options) {
    return await esClient.create(
      lodash.extend({
        index: indexName
      },
        lodash.pick(options, ['type', 'id', 'body'])
      )
    )
  },

  search: async function (params) {
    return await esClient.search(
      lodash.extend({
        index: indexName
      },
        lodash.pick(params, ['type', 'body'])
      )
    ).then(result => {
      return this.transformResult().getHits(result);
    })
  },

  buildQuery: (options) => {
    return {
      activeJob: () => ({
        "term": {
          "status": "ACTIVE"
        }
      }),
      textSearch: ({ text, options }) => {
        let shouldArr = [];
        shouldArr = shouldArr.concat((options.keys || []).map(key => ({
          wildcard: {
            [key]: `*${lodash.toLower(text)}*`
          }
        })));
        shouldArr = shouldArr.concat((options.nestedKeys || []).map(key => ({
          nested: {
            path: key.split('.').shift(),
            query: {
              wildcard: {
                [key]: `*${lodash.toLower(text)}*`
              }
            }
          }
        })));

        return {
          bool: {
            should: shouldArr
          }
        }
      }
    }
  },

  transformResult: (options) => {
    return {
      getHits: (result) => {
        return {
          total: result.hits.total,
          list: result.hits.hits.map(hit => lodash.extend(hit._source, { _id: hit._id }))
        };
      }
    }
  }
}