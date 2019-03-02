/*
 - only 1 hotjob for each company
 - default duration is 1 day
 - default status is PENDING
 - need Back-office's operator to approve
 - at a moment, there are 15 hot jobs only
*/

const constants = require("../../../constants");
const { INACTIVE, ACTIVE } = constants.HOT_JOB_STATUS;
const moment = require("moment");
const debuglog = require("debug")("jv:hotjob:approve");

module.exports = async function (req, res) {
  try {
    const { id } = req.params;
    let count = await HotJob.count({
      status: ACTIVE,
      expiredAt: { ">": moment.now() }
    });
    if (count >= 15) {
      return res.notFound({
        message: "At a moment, there are 15 hot jobs only",
        code: "LIMITED_HOTJOB"
      });
    }
    let hotJob = await HotJob.updateOne({
      id: id,
      status: INACTIVE
    }).set({
      status: ACTIVE,
      activatedAt: +new Date()
    });

    debuglog("- hotJob ", hotJob);

    hotJob ? res.ok(hotJob) : res.notFound({
      message: "Request hot job not found",
      code: "NOT_FOUND"
    });
  } catch (error) {
    return res.serverError({
      message: `Something went wrong.`,
      code: "INTERNAL_SERVER_ERROR",
      error: error.stack
    });
  }
};

