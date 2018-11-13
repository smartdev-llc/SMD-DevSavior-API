const moment = require("moment");
const debuglog = require("debug")("jv:job:count");


module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");

  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to count jobs."
    });
  }

  const queryBody = _.extend(req.query, {companyId});

  const buildQuery = ElasticsearchService.buildQuery(queryBody);

  let query = { bool: { must: [] } };

  query.bool.must = query.bool.must.concat(buildQuery.identifiers({
    nestedIdNames: [{
      request: 'companyId',
      path: 'company',
      field: 'company.id'
    }]
  }));

  var now = moment.now();
  var daysLater = moment().add(sails.config.custom.jobExpiresSoonDuration || 2, 'day').valueOf();

  var aggs = {
    active: {
      filter: {
        range: {
          expiredAt: {
            gt: daysLater
          }
        }
      }
    },
    expired: {
      filter: {
        range: {
          expiredAt: {
            lt: now
          }
        }
      }
    },
    expiresSoon: {
      filter: {
        range: {
          expiredAt: {
            gt: now,
            lt: daysLater
          }
        }
      }
    }
  }

  debuglog('query: ', JSON.stringify(query));
  debuglog('aggs: ', JSON.stringify(aggs));
  
  try {
    let queryResult = await ElasticsearchService.search({
      type: 'Job',
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
