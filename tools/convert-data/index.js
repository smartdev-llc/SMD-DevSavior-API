const lodash = require("lodash");
const config = require("config");
const Promise = require("bluebird");
const elasticsearch = require("elasticsearch");

const es = new elasticsearch.Client(config.elasticsearch.connection);
const esClient = Promise.promisifyAll(es, { context: es });
let total = 0;

function done(error) {
  console.log("==========DONE============");
  console.log("Total:", total);
  error && console.log(JSON.stringify(error));
  error && console.log(error.stack);
}

function update(createdAt) {
  return esClient.search({
    index: config.elasticsearch.indexName,
    type: "Job",
    size: config.batchSize,
    body: {
      sort: { createdAt: "asc" },
      _source: [
        "_juniorviec_.updatedTime",
        "createdAt",
        "_juniorviec_.createdTime"
      ],
      query: {
        bool: {
          must: [{
            range: {
              createdAt: {
                gt: createdAt
              }
            }
          }]
        }
      }
    }
  }).then((result) => {
    if (createdAt === 0) {
      total = result.hits.total;
    }
    if (result.hits.total === 0) {
      return done();
    } else {
      const createdAt = result.hits.hits[result.hits.hits.length - 1]._source.createdAt;
      const bulk = result.hits.hits.reduce((arr, hit) => {
        arr.push({ update: lodash.pick(hit, ["_index", "_type", "_id"]) });
        arr.push({
          doc: {
            _juniorviec_: {
              createdTime: (new Date(hit._source._juniorviec_.createdTime).toISOString()),
              updatedTime: (new Date()).toISOString(),
            }
          }
        });
        return arr;
      }, []);
      return esClient.bulk({ body: bulk }).then(() => {
        if (result.total === config.batchSize) {
          return update(createdAt);
        } else {
          return done();
        }
      });
    }
  }).catch(done);
}

update(0);
