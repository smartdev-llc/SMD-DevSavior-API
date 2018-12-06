const {
  INTERNAL_SERVER_ERROR,
  MISSING_PARAMETERS,
  NOT_FOUND,
  PERMISSION_DENIED
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const { size = 10, page = 0 } = _.get(req, "query");
  let limit = parseInt(size);
  let skip = parseInt(page) * limit;

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
    let jobApplications = await JobApplication.find({ job: jobId })
      .skip(skip)
      .limit(limit)
      .sort("createdAt desc");

    let students = await Student.find({ id: _.map(jobApplications, "student") })
      .populate('educationDegrees');

    let stdMappings = _.keyBy(students, "id");

    res.ok({
      total,
      size: parseInt(size),
      page: parseInt(page),
      list: _.map(jobApplications, item => _.extend(stdMappings[item.student], { appliedTime: item.createdAt }))
    });
  } catch (err) {
    return res.serverError({
      code: INTERNAL_SERVER_ERROR,
      message: "Something went wrong.",
      data: err.message
    });
  }
}
