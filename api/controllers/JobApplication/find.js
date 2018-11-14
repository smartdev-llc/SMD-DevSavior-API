const debuglog = require('debug')('jv:candicates');
const Promise = require('bluebird');

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const { size, page } = _.get(req, "query");
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;
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
    const job = await Job.findOne({ id: jobId }).populate('students', {
      skip, limit,
    });

    if (!job) {
      return res.badRequest({
        code: "JOB_NOT_FOUND",
        message: 'Job is not found'
      });
    }
    const candicates = await Promise.map(job.students, student => {
      return Profile.findOne({ owner: student.id }).then(profile => {
        return _.extend(student, { profile });
      })
    });
    res.ok(candicates);
  } catch (err) {
    debuglog("error:", err)
    return res.serverError({
      code: "SERVER_ERROR",
      message: "Something went wrong.",
      data: err
    });
  }
}
