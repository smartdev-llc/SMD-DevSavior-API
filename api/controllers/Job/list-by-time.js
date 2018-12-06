const moment = require("moment");
const debuglog = require("debug")("jv:job:count");
const { 
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");

  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to count jobs."
    });
  }

  const queryBody = _.extend(req.query, { companyId });
  let { size, page } = queryBody;
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;

  const buildQuery = ElasticsearchService.buildQuery(queryBody);
  const transformResult = ElasticsearchService.transformResult();

  let query = { bool: { must: [] } };

  query.bool.must = query.bool.must.concat(buildQuery.identifiers({
    nestedIdNames: [{
      request: 'companyId',
      path: 'company',
      field: 'company.id'
    }]
  }));

  let now = moment.now();
  let daysLater = moment().add(sails.config.custom.jobExpiresSoonDuration || 2, 'day').valueOf();

  switch (queryBody.type) {
    case "all": break;
    case "active":
      query.bool.must.push({
        range: {
          expiredAt: {
            gt: daysLater
          }
        }
      });
      break;
    case "expired":
      query.bool.must.push({
        range: {
          expiredAt: {
            lt: now
          }
        }
      });
      break;
    case "expiresSoon":
      query.bool.must.push({
        range: {
          expiredAt: {
            gt: now,
            lt: daysLater
          }
        }
      });
      break;
    default: break;
  }

  debuglog('query: ', JSON.stringify(query));

  try {
    let result = await ElasticsearchService.search({
      type: 'Job',
      body: {
        "size": limit,
        "from": skip,
        "query": query
      }
    }).then(transformResult.getHits);

    res.ok(_.extend({ from: skip, size: limit }, result));
  } catch (err) {
    return res.serverError({
      code: INTERNAL_SERVER_ERROR,
      message: "Something went wrong.",
      data: err
    });
  }
};
