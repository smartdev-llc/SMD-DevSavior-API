const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = require("../../../constants/error-code");

const constants = require('../../../constants');
const {
  ACTIVE
} = constants.STATUS;

const moment = require('moment');
module.exports = async function (req, res) {
  try {
    const {
      size,
      page
    } = _.get(req, "query");
    const {
      jobId
    } = _.get(req, "params");
    let limit = parseInt(size) || 10;
    let skip = (parseInt(page) || 0) * limit;

    const transformResult = ElasticsearchService.transformResult();

    let job;
    try {
      job = await Job
        .findOne({
          id: jobId
        })
        .populate("skills", {
          select: ["id", "name"]
        });
    } catch (err) {
      return res.serverError({
        message: `Something went wrong.`,
        devMessage: err.message,
        code: INTERNAL_SERVER_ERROR
      });
    }

    if (!job) {
      return res.notFound({
        message: "Job not found",
        code: NOT_FOUND
      });
    }

    const should = _.map(job.skills, value => {
      return {
        "nested": {
          "path": "skills",
          "query": {
            "match": {
              "skills.name": value.name
            }
          }
        }
      };
    });

    let query = {
      "bool": {
        "must_not": {
          "match": {
            "_id": jobId
          }
        },
        "must": [
          {
            "term": {
              "status": ACTIVE
            }
          }, 
          {
            "range": {
              "expiredAt": {
                gte: moment.now()
              }
            }
          },
          {
            "bool": {
              should
            }
          }
        ],
      }
    };

    let result = await ElasticsearchService.search({
      type: "Job",
      body: {
        "size": limit,
        "from": skip,
        "query": query,
        "sort": [{
          "updatedAt": {
            "order": "desc"
          }
        }, ]
      }
    }).then(transformResult.getHits);

    return res.ok(_.extend(result, {
      size: limit,
      from: skip
    }));
  } catch (err) {
    res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
};
