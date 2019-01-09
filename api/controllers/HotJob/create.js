/*
 - only 1 hotjob and 1 pending hotjob for each company
 - default duration is 1 day
 - default status is PENDING
 - need Back-office's operator to approve
 - at a moment, there are 15 hot jobs only
*/

const constants = require("../../../constants");
const { PENDING } = constants.HOT_JOB_STATUS;
const moment = require("moment");
const debuglog = require("debug")("jv:hotjob:create");

module.exports = async function (req, res) {
  try {
    const { jobId } = req.body;
    debuglog("- jobId ", jobId);
    const companyId = _.get(req, "user.id");
    if(!jobId){
      return res.status(400).json({
        message: "Job is required.",
        code: "VALIDATION_ERROR"
      });
    }
    let exists = await HotJob.findOne({
      company: companyId,
      status: PENDING,
      expiredAt: { ">": moment.now() }
    });
    debuglog("- exists ", exists);
    if (exists) {
      return res.status(400).json({
        message: "Your company has 1 pending hot job already.",
        code: "HOT_JOB_EXISTS"
      });
    } 

    let job = await Job.findOne({
      id: jobId,
      company: companyId,
      status: constants.STATUS.ACTIVE
    });
    debuglog("- job ", job);
    if (!job) {
      return res.notFound({
        message: "Job not found or has not approved yet.",
        code: "NOT_FOUND"
      });
    }

    let hotJob = await HotJob.create({
      job: jobId,
      company: companyId
    });

    res.ok(hotJob);
  } catch (error) {
    return res.serverError({
      message: "Something went wrong.",
      code: "INTERNAL_SERVER_ERROR",
      error: error.stack
    });
  }
};

