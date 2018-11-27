const {
  INTERNAL_SERVER_ERROR,
  MISSING_PARAMETERS,
  NOT_FOUND,
  PERMISSION_DENIED
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const { size, page } = _.get(req, "query");
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;

  const { jobId } = req.params;

  if (!jobId) {
    return res.badRequest({
      code: MISSING_PARAMETERS,
      message: "Missing parameters.",
      devMessage: "`jobId` is missing"
    });
  }

  try {
    const job = await Job.findOne({ id: jobId });

    if (!job) {
      return res.notFound({
        code: NOT_FOUND,
        message: 'Job is not found',
        devMessage: 'Job is not found'
      });
    }

    if (job.company !== companyId) {
      return res.forbidden({
        message: "You have no permissions to do this action.",
        devMessage: "You are not the owner of this job.",
        code: PERMISSION_DENIED
      })
    }

    const total = await JobApplication.count({ job: jobId });
    const jobApplications = await JobApplication.find({ job: jobId });
    const studentIds = _.reduce(jobApplications, (stds, apl) => _.concat(stds, apl.student), []);

    const students = await Student.find({ id: studentIds })
      .skip(skip)
      .limit(limit)
      .populate('workingPreference')
      .populate('workingExperiences')
      .populate('educationDegrees');

    res.ok({
      size, 
      page,
      total,
      list: students
    });
  } catch (err) {
    return res.serverError({
      code: INTERNAL_SERVER_ERROR,
      message: "Something went wrong.",
      data: err.message
    });
  }
}
