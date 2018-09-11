const elasticsearch = require('elasticsearch');
const lodash = require('lodash');
const config = sails.config.custom.elasticsearch;
const indexName = config.indexName;

const esClient = new elasticsearch.Client(config.connection);

module.exports = {

  create: async function (options) {
    return await esClient.create(
      lodash.extend({
        index: indexName
      },
        lodash.pick(options, ['type', 'id', 'body'])
      )
    )
  }

}