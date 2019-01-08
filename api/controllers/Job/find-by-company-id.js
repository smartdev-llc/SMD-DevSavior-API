/**
 * For student to find jobs created by a specific company
 */

const {
  MISSING_PARAMETERS,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');
const constants = require('../../../constants');
const { ACTIVE } = constants.STATUS;

module.exports = async function (req, res) {
  const companyId = _.get(req, "params.companyId");
  const { size, page } = _.get(req, 'query');
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;

  if (!companyId) {
    return res.badRequest({
      message: "Missing parameter.",
      devMessage: "`companyId` is missing.",
      code: MISSING_PARAMETERS
    });
  }

  try {
    const where = {
      company: companyId, status: ACTIVE
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
      page
    });
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

};
