const moment = require("moment");
const constants = require("../../../constants");
const { MAXIMUM_ELEMENT_COUNT } = constants;
const {ACTIVE, PENDING} = constants.HOT_JOB_STATUS;
module.exports = async function (req, res) {
  try {
    const userId = _.get(req, "user.id");
    const role = _.get(req, "user.role");
    let query = {
    };
    if (role === "company") {
      query.company = userId;
      query.or = [{
        status: PENDING
      },{
        status: ACTIVE,
        expiredAt: { ">=": moment.now() }
      }];
    } else {
      query.expiredAt = { ">=": moment.now() };
      query.status = ACTIVE;
    }
    const jobs = await HotJob.find()
      .where(query)
      .populate("job")
      .limit(MAXIMUM_ELEMENT_COUNT);

    return res.ok(jobs);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      code: "INTERNAL_SERVER_ERROR",
      error: err.stack
    });
  }
};
