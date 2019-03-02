const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const companyId = _.get(req, 'user.id');
  const { jobId, applicantId } = req.params;

  try {
    const job = await Job.findOne({ company: companyId, id: jobId });
    if (!job) {
      return res.notFound({
        message: "Job not found",
        devMessage: "Job not found",
        code: NOT_FOUND
      })
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }

  try {
    const jobApplication = await JobApplication.findOne({ job: jobId, student: applicantId });
    if (!jobApplication) {
      return res.notFound({
        message: "This applicant is not found",
        devMessage: "JobApplication not found",
        code: NOT_FOUND
      })
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }

  try {
    const profile = await Student.findOne({ id: applicantId })
      .populate('workingPreference')
      .populate('workingExperiences')
      .populate('educationDegrees');

    if (!profile) {
      return res.notFound({
        message: 'Student profile is not found.',
        devMessage: 'Student profile is not found.',
        code: NOT_FOUND
      });
    }
    res.ok(profile);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
}