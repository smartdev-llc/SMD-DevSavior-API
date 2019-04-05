/**
 * For student to find jobs created by a specific company
 */

const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = require('../../../constants/error-code');
const constants = require('../../../constants');
const { ACTIVE } = constants.STATUS;

const moment = require('moment');

module.exports = async function (req, res) {
  const slug = _.get(req, "params.slug");
  const { size, page } = _.get(req, 'query');
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;
  const sort = 'approvedAt';

  if (!slug) {
    return res.badRequest({
      message: "Company is not found.",
      devMessage: "Company is not found.",
      code: NOT_FOUND
    });
  }

  try {

    const company = await company.findOne({ slug });

    const where = {
      company: company.id,
      status: ACTIVE,
      expiredAt: {
        '>=': moment.now()
      }
    }

    const total = await Job.count({}).where(where);

    const jobs = await Job
    .find({})
    .where(where)
    .populate('skills', { select: ['id', 'name'] })
    .populate('category')
    .populate('company')
    .populate('students')
    .sort(sort)
    .limit(limit)
    .skip(skip);

    return res.ok({
      total,
      list: jobs,
      size: limit,
      from: skip
    });
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

};
