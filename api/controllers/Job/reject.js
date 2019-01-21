
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CANNOT_EXECUTE_ACTION
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { PENDING, REJECTED } = constants.STATUS
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

  if (job.status !== PENDING) {
    return res.badRequest({
      message: 'Cannot execute this action. Job is not pending.',
      devMessage: 'Job status is not active.',
      code: CANNOT_EXECUTE_ACTION
    });
  }

  try {

    let updatedBody = {
      status: REJECTED
    };

    await Job.update({ id })
      .set(updatedBody);

    await ElasticsearchService.update({
      type: 'Job',
      id,
      body: {
        doc: updatedBody
      }
    });
    return res.ok({
      message: 'Rejected succesfully.'
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}