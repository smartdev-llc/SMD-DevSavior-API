
const moment = require('moment');

const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  INVALID_PARAMETERS,
  CANNOT_EXECUTE_ACTION
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { REJECTED, ACTIVE, INACTIVE, PENDING } = constants.STATUS
module.exports = async function (req, res) {
  const { jobId } = _.get(req, "params");
  const { value: status } = req.body;

  if (!isValidStatus(status)) {
    return res.badRequest({
      message: 'Invalid new status.',
      devMessage: 'Invalid new status (should be ACTIVE, INACTIVE, REJECTED).',
      code: INVALID_PARAMETERS
    })
  }

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

  const currentStatus = job.status || PENDING;

  if (!isValidAction(status, currentStatus)) {
    return res.badRequest({
      message: 'Cannot execute this action.',
      devMessage: getErrorMessage(status),
      code: CANNOT_EXECUTE_ACTION
    });
  }

  try {

    let updatedBody = {
      status
    }

    if (status === ACTIVE && currentStatus !== INACTIVE) {
      updatedBody.approvedAt = moment().valueOf();
      updatedBody.expiredAt = moment().add(sails.config.custom.jobDuration || 7, 'days').valueOf();
    }
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
      message: `Set to ${status} successfully.`
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}

const isValidStatus = (status) => {
  return _.indexOf([ACTIVE, INACTIVE, REJECTED], status) > -1;
}

const isValidAction = (newStatus, currentStatus) => {
  switch (newStatus) {
    // approve a job
    case ACTIVE: return (currentStatus === PENDING || currentStatus === REJECTED || currentStatus === INACTIVE);
    // deactivate a job
    case INACTIVE: return (currentStatus === ACTIVE);
    // reject a job
    case REJECTED: return (currentStatus === PENDING);
    // invalid status
    default: return false;
  }
}

const getErrorMessage = status => {
  const message = "Cannot execute action";
  switch (status) {
    case ACTIVE: return `${message}. Only set ACTIVE for PENDING/REJECTED/INACTIVE job.`;
    case INACTIVE: return `${message}. Only set INACTIVE for ACTIVE job.`;
    case REJECTED: return `${message}. Only set REJECTED for PENDING job.`;
    // invalid status
    default: return `${message}. Invalid status.`;;
  }
}