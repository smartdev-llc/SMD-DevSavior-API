/*
 - only 1 hotjob for each company
 - default duration is 1 day
 - default status is PENDING
 - need Back-office's operator to approve
*/

const constants = require("../../../constants");
const { PENDING, APPROVED } = constants.HOT_JOB_STATUS;
const moment = require("moment");
const debuglog = require("debug")("jv:hotjob:approve");

module.exports = async function (req, res) {
  try {
    const { id } = req.params;
    // let job = await Job.findOne({
    //   id: jobId,
    //   status: constants.STATUS.ACTIVE
    // });
    // if (!job) {
    //   return res.notFound({
    //     message: "Job not found.",
    //     code: "NOT_FOUND"
    //   });
    // }
    let hotJob = await HotJob.updateOne({
      id: id,
      status: PENDING
    }).set({
      status: APPROVED,
      expiredAt: moment().add(1, "day").valueOf(),
      expiredDay: moment().add(1, "day").valueOf(),
      approvedAt: +new Date()
    });
    
    debuglog("- hotJob ", hotJob);

    res.ok(hotJob);
  } catch (error) {
    return res.serverError({
      message: `Something went wrong.`,
      code: "INTERNAL_SERVER_ERROR",
      error: error.stack
    });
  }
};

