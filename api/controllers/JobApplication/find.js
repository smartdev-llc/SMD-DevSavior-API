const debuglog = require('debug')('jv:candicates');

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  debuglog('companyId: ', companyId);
  if (!companyId) {
    return res.unauthorized({
      code: "UNAUTHORIZED_COMPANY",
      message: "You need login as a company to get candicates."
    });
  }
  const { jobId } = req.params;
  debuglog('jobId: ', jobId);

  if (!jobId) {
    return res.badRequest({
      code: "BAD_REQUEST",
      message: "Missing parameters."
    });
  }

  try {
    const job = await Job.findOne({ id: jobId }).populate('students');

    if (!job) {
      return res.badRequest({
        code: "JOB_NOT_FOUND",
        message: 'Job is not found'
      });
    }
    res.ok(job.students);
  } catch (err) {
    debuglog("error:", err)
    return res.serverError({
      code: "SERVER_ERROR",
      message: "Something went wrong.",
      data: err
    });
  }
}
