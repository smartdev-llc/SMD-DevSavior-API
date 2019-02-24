
const moment = require('moment');

const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CANNOT_EXECUTE_ACTION,
  MISSING_PARAMETERS
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { ACTIVE, PENDING, REJECTED } = constants.STATUS;

const sendEmailToCompany = (job) => {
  const contentData = {
    job: _.pick(job, ['id', 'title']),
    company: job.company,
    jobLink: `${process.env.WEB_URL}/jobs/${job.id}`
  };
  EmailService.sendToUser({ email: _.get(job, 'company.email') }, "job-is-approved-email", contentData);
};

module.exports = async function (req, res) {
  const { id } = _.get(req, "params");

  if (!id || id === "undefined") {
    return res.badRequest({
      message: "Job id is missing.",
      devMessage: "Job id is missing.",
      code: MISSING_PARAMETERS
    });
  }

  let job;

  try {
    job = await Job.findOne({ id }).populate("company");
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!job) {
    return res.notFound({
      message: 'Job is not found.',
      devMessage: 'Job is not found.',
      code: NOT_FOUND
    });
  }

  if (job.status !== PENDING && job.status !== REJECTED) {
    return res.badRequest({
      message: 'Cannot execute this action. Job is not pending and not rejected.',
      devMessage: 'Job status is not pending and not rejected.',
      code: CANNOT_EXECUTE_ACTION
    });
  }

  try {

    let updatedBody = {
      status: ACTIVE,
      approvedAt: moment.now(),
      expiredAt: moment().add(sails.config.custom.jobDuration || 7, 'days').valueOf()
    };

    const updatedJob = await Job.updateOne({ id })
      .set(updatedBody);

    await ElasticsearchService.update({
      type: 'Job',
      id,
      body: {
        doc: updatedBody
      }
    });

    sendEmailToCompany(job);

    return res.ok(updatedJob);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}