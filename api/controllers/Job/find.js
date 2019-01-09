const {
  INTERNAL_SERVER_ERROR,
  INVALID_PARAMETERS
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { PENDING, REJECTED, ACTIVE, INACTIVE } = constants.STATUS

module.exports = async function (req, res) {
  let { size, page, status } = _.get(req, 'query');
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;

  if (status && !isValidStatus(status)) {
    status = undefined;
  }

  try {
    const where = {
      status
    }

    const total = await Job.count({}).where(where);

    const jobs = await Job
    .find({})
    .where(where)
    .populate('skills', { select: ['id', 'name'] })
    .populate('category')
    .populate('company')
    .sort('createdAt DESC')
    .limit(limit)
    .skip(skip);

    return res.ok({
      total,
      list: jobs,
      size,
      page,
      status
    });
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}

isValidStatus = (stt) => _.indexOf([PENDING, REJECTED, ACTIVE, INACTIVE], stt) > -1;