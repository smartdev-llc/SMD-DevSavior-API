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

<<<<<<< HEAD
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
=======
  var aggs = {
>>>>>>> c407d26dc60c9fdba612ec612418bf1800eac95f
    expired: {
      filter: {
        range: {
          expiredAt: {
<<<<<<< HEAD
            lt: now
=======
            lt: moment.now()
>>>>>>> c407d26dc60c9fdba612ec612418bf1800eac95f
          }
        }
      }
    },
    expiresSoon: {
      filter: {
        range: {
          expiredAt: {
<<<<<<< HEAD
            gt: now,
            lt: daysLater
=======
            gt: moment.now(),
            lt: moment().add(sails.config.custom.jobExpiresSoonDuration || 2, 'day').valueOf()
>>>>>>> c407d26dc60c9fdba612ec612418bf1800eac95f
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
