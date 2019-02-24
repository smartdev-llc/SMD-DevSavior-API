const {
  INVALID_PARAMETERS,
  MISSING_PARAMETERS,
  ALREADY_APPLIED,
  INTERNAL_SERVER_ERROR
} = require("../../../constants/error-code");

const moment = require("moment");

const { STATUS } = require("./../../../constants");

const sendEmailToCompany = (job, user) => {
  const contentData = {
    job: _.pick(job, ['id', 'title']),
    company: job.company,
    user,
    jobLink: `${process.env.WEB_URL}/jobs/${job.id}`,
    applicantLink: `${process.env.EMPLOYER_URL}/jobs/${job.id}/candidates/${user.id}`
  };
  EmailService.sendToUser({ email: company.email }, "new-candidate-email", contentData);
};

module.exports = async function (req, res) {
  const user = _.get(req, "user");
  const userId = _.get(req, "user.id");
  const { jobId } = req.params;

  if (!jobId || jobId === "undefined") {
    return res.badRequest({
      message: "Job is missing.",
      devMessage: "`jobId` is missing.",
      code: MISSING_PARAMETERS
    });
  }

  try {
    const student = await Student.findOne({ id: userId }).populate("workingPreference");

    const requireKeys = [
      "displayEmail",
      "profileImageURL",
      "phoneNumber",
      "gender",
      "dateOfBirth",
      "maritalStatus",
      "country",
      "currentAddress",
      "city",
      "jobTitle",
      "educationalStatus",
      "workingPreference",
      "skills"
    ];

    let missingKeys = [];
    _.map(requireKeys, item => {
      !!_.isEmpty(student[item]) && missingKeys.push(item);
    });

    if (!_.isEmpty(missingKeys)) {
      return res.badRequest({
        message: `Some paramters are missing: [${missingKeys}]. Please update your profile.`,
        devMessage: `Some paramters are missing: [${missingKeys}].`,
        code: MISSING_PARAMETERS,
        data: missingKeys
      });
    }

  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
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

  if (job.expiredAt < moment.now()) {
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
    await Job.addToCollection(jobId, "students").members([userId]);

    sendEmailToCompany(job, user);

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
