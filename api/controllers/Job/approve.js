
const moment = require('moment');

const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CANNOT_EXECUTE_ACTION
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { ACTIVE, PENDING, REJECTED } = constants.STATUS
module.exports = async function (req, res) {
  const { jobId } = _.get(req, "params");

  let job;

  try {
    job = await Job.findOne({ id: jobId });
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

    await Job.update({ id: jobId })
      .set(updatedBody);

    await ElasticsearchService.update({
      type: 'Job',
      id: jobId,
      body: {
        doc: updatedBody
      }
    });
    return res.ok({
      message: 'Approved succesfully.'
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}