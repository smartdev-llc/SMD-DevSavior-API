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
      textSearch: ({ text, keys }) => {
        return {
          bool: {
            should: keys.map(key => ({
              wildcard: {
                [key]: `*${lodash.toLower(text)}*`
              }
            }))
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