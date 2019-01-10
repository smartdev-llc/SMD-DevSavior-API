const {
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { PENDING, REJECTED, ACTIVE, INACTIVE } = constants.STATUS

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  const role = _.get(req, 'user.role');
  let { size, page, status, companyId } = _.get(req, 'query');
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;
  let sort = 'createdAt DESC';

  if (status && !isValidStatus(status)) {
    status = undefined;
  }

  if (role !== 'admin' || role !== 'company') {
    status = ACTIVE;
    sort = 'approvedAt DESC';
  }

  let where = {
    status
  }

  if (companyId) {
    try {
      let foundCompany = await Company.findOne({ id: companyId });
      foundCompany && (where.company = companyId);
    } catch (err) {
      // Company not found, ignore filter by company id
    }
  }

  if (role === 'company') {
    where.company = userId;
  }


  try {

    const total = await Job.count({}).where(where);

    const jobs = await Job
    .find({})
    .where(where)
    .populate('skills', { select: ['id', 'name'] })
    .populate('category')
    .populate('company')
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
}

isValidStatus = (stt) => _.indexOf([PENDING, REJECTED, ACTIVE, INACTIVE], stt) > -1;