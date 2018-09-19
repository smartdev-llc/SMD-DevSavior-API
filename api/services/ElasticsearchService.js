const elasticsearch = require('elasticsearch');
const Promise = require('bluebird');
const indexName = process.env.ES_INDEX_NAME || 'juniorviec';
const connectionConfig = {
  host: process.env.ES_HOST || '127.0.0.1:9200',
  log: process.env.ES_LOG_LEVEL || 'trace'
}

let es = new elasticsearch.Client(connectionConfig);
const esClient = Promise.promisifyAll(es, { context: es });

module.exports = {

  create: async function (options) {
    return await esClient.create(
      _.extend({
        index: indexName
      },
        _.pick(options, ['type', 'id', 'body'])
      )
    )
  },

  search: async function (params) {
    return await esClient.search(
      _.extend({
        index: indexName
      },
        _.pick(params, ['type', 'body'])
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
            [key]: `*${_.toLower(text)}*`
          }
        })));
        shouldArr = shouldArr.concat((options.nestedKeys || []).map(key => ({
          nested: {
            path: key.split('.').shift(),
            query: {
              wildcard: {
                [key]: `*${_.toLower(text)}*`
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
          list: result.hits.hits.map(hit => _.extend(hit._source, { _id: hit._id }))
        };
      }
    }
  }
}