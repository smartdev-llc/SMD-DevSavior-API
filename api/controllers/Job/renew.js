
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CANNOT_EXECUTE_ACTION
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { ACTIVE } = constants.STATUS;

const moment = require('moment');

const sendEmailToCompany = (job) => {
  const contentData = {
    job: _.pick(job, ['id', 'title']),
    company: job.company,
    jobLink: `${process.env.WEB_URL}/jobs/${job.id}`
  };
  EmailService.sendToUser({ email: _.get(job, 'company.email') }, "job-is-renewed-email", contentData);
};

module.exports = async function (req, res) {
  const { id } = _.get(req, "params");

  let job;

  try {
    job = await Job.findOne({ id });
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

  if (job.status !== ACTIVE) {
    return res.badRequest({
      message: 'Cannot execute this action. Job is not active.',
      devMessage: 'Job status is not active.',
      code: CANNOT_EXECUTE_ACTION
    });
  }

  if (job.expiredAt > moment.now()) {
    return res.badRequest({
      message: 'Cannot execute this action. Job is not expired.',
      devMessage: 'Job is not expired.',
      code: CANNOT_EXECUTE_ACTION
    });
  }

  try {

    let updatedBody = {
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