const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  WRONG_STATUS
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { REJECTED, ACTIVE } = constants.STATUS
module.exports = async function (req, res) {
  const { jobId } = _.get(req, "params");
  const { status } = req.body;

  if (!isValidStatus(status)) {
    return res.serverError({
      message: 'Invalid status parameter',
      devMessage: 'status param is missing or incorrect value input, must be [REJECTED, ACTIVE]',
      code: WRONG_STATUS
    });
  }

  try {
    const job = await Job.findOne({ id: jobId });
    if (!job) {
      return res.notFound({
        message: 'Job is not found.',
        devMessage: 'Job is not found.',
        code: NOT_FOUND
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
    await Job.update({ id: jobId })
      .set({ status });

    await ElasticsearchService.update({
      type: 'Job',
      id: jobId,
      body: {
        doc: {
          status
        }
      }
    });
    return res.ok({
      message: 'Update job status successfully.'
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}

isValidStatus = (value) => {
  return value && value === REJECTED || value === ACTIVE;
}