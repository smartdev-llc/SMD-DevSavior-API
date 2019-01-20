const {
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { PENDING, REJECTED, ACTIVE, INACTIVE } = constants.STATUS;
const moment = require('moment');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  const role = _.get(req, 'user.role');
  let { size, page, status, companyId } = _.get(req, 'query');
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;
  let sort = 'createdAt DESC';
  let expiredAt;

  if (!isValidStatus(status)) {
    status = undefined;
  }

  if (role !== 'admin' && role !== 'company') {
    status = ACTIVE;
    sort = 'approvedAt DESC';
    expiredAt = {
      '>': moment.now()
    }
  }

  let where = {
    status,
    expiredAt
  }

  if (role !== 'company') {
    if (companyId) {
      try {
        let foundCompany = await Company.findOne({ id: companyId });
        foundCompany && (where.company = companyId);
      } catch (err) {
        // Company not found, ignore filter by company id
      }
    }
  } else {
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
}

const isValidStatus = (stt) => _.indexOf([PENDING, REJECTED, ACTIVE, INACTIVE], stt) > -1;