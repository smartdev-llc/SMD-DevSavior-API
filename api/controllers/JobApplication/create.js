const {
  INVALID_PARAMETERS,
  MISSING_PARAMETERS,
  ALREADY_APPLIED,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

const moment = require('moment');

const { STATUS } = require("./../../../constants");

const sendEmailToCompany = (job, company, user) => {
  const contentData = {
    job,
    company,
    user,
    jobLink: `${process.env.WEB_URL}/employer/jobs/${job.id}`,
    applicantLink: `${process.env.WEB_URL}/employer/jobs/${job.id}/candidates/${user.id}`
  };
  EmailService.sendToUser( { email: company.email }, 'new-candidate-email', contentData);
};

module.exports = async function (req, res) {
  const user = _.get(req, 'user');
  const userId = _.get(req, 'user.id');
  const { jobId } = req.params;

  if (!jobId || jobId === 'undefined') {
    return res.badRequest({
      message: "Job is missing.",
      devMessage: "`jobId` is missing.",
      code: MISSING_PARAMETERS
    });
  }

  let job;
  try {
    job = await Job.findOne({ id: jobId }).populate("company");
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!job) {
    return res.badRequest({
      message: "Invalid job.",
      devMessage: "Invalid job id, can not found.",
      code: INVALID_PARAMETERS
    });
  }

  if (job.status !== STATUS.ACTIVE) {
    return res.badRequest({
      message: "Invalid job.",
      devMessage: "Job is not active.",
      code: INVALID_PARAMETERS
    });
  }

  if (job.expiredAt > moment.now()) {
    return res.badRequest({
      message: "Invalid job.",
      devMessage: "Job is expired.",
      code: INVALID_PARAMETERS
    });
  }

  try {
    const isApplied = await JobApplication.findOne({ job: jobId, student: userId });

    if (isApplied) {
      return res.conflict({
        message: "You have already applied this job.",
        devMessage: "You have already applied this job.",
        code: ALREADY_APPLIED
      });
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  try {
    await Job.addToCollection(jobId, 'students').members([userId]);

    sendEmailToCompany(job, _.get(job, 'company'), user);

    res.ok({
      message: "Applied " + job.title + "."
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
};
