const moment = require("moment");
const debuglog = require("debug")("jv:job:count");
const { STATUS } = require("./../../../constants");

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");

  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to count jobs."
    });
  }

  const queryBody = _.extend(req.query, { companyId });

  const buildQuery = ElasticsearchService.buildQuery(queryBody);

  let query = { bool: { must: [] } };

  query.bool.must = query.bool.must.concat(buildQuery.identifiers({
    nestedIdNames: [{
      request: "companyId",
      path: "company",
      field: "company.id"
    }]
  }));

  let aggs = {};

  _.values(STATUS).forEach(status => {
    aggs[status] = {
      filter: {
        term: {
          status: status
        }
      }
    };
  });

  debuglog("query: ", JSON.stringify(query));
  debuglog("aggs: ", JSON.stringify(aggs));

  try {
    let queryResult = await ElasticsearchService.search({
      type: "Job",
      body: {
        "size": 0,
        "query": query,
        "aggs": aggs
      }
    });

    return res.ok(_.mapValues(queryResult.aggregations, "doc_count"));
  } catch (err) {
    return res.serverError({
      code: "INTERNAL",
      message: "Something went wrong.",
      data: err
    });
  }
};
