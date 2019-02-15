
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CANNOT_EXECUTE_ACTION
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { INACTIVE, ACTIVE } = constants.STATUS;

const moment = require('moment');

const sendEmailToCompany = (job) => {
  const contentData = {
    job: _.pick(job, ['id', 'title']),
    company: job.company,
    jobLink: `${process.env.WEB_URL}/jobs/${job.id}`
  };
  EmailService.sendToUser({ email: _.get(job, 'company.email') }, "job-is-activated-email", contentData);
};

module.exports = async function (req, res) {
  const { id } = _.get(req, "params");

  let job;

  try {
    job = await Job.findOne({ id }).populate('company');
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

  if (job.status !== INACTIVE) {
    return res.badRequest({
      message: 'Cannot execute this action. Job is not inactive.',
      devMessage: 'Job status is not inactive.',
      code: CANNOT_EXECUTE_ACTION
    });
  }

  if (job.expiredAt <= moment.now()) {
    return res.badRequest({
      message: 'Cannot execute this action. Job is expired.',
      devMessage: 'Job is expired.',
      code: CANNOT_EXECUTE_ACTION
    });
  }

  try {

    let updatedBody = {
      status: ACTIVE
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