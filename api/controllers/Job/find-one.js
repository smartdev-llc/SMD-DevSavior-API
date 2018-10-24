const { COMPANY_PUBLIC_FIELDS } = require('../../../constants');

module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");
  const id = _.get(req, "params.id");

  if (userId && role == 'company') {
    await findOneByCompanyId(req, res, userId, id);
  } else {
    await findOne(req, res, id);
  }
}

const findOneByCompanyId = async (req, res, userId, id) => {
  try {
    const job = await Job
      .findOne({ id, company: userId })
      .populate('company')
      .populate('students', { select: ['id', 'firstName', 'lastName'] })
      .populate('skills', { select: ['id', 'name'] })
      .populate('category',  { select: ['id', 'name'] });

    if (!job) {
      return res.notFound({
        message: 'Job is not found.'
      });
    }

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`
    });
  }
}

const findOne = async (req, res, id) => {
  try {
    const job = await Job
      .findOne({ id })
      .populate('company')
      .populate('skills', { select: ['id', 'name'] })
      .populate('category');

    if (!job) {
      return res.notFound({
        message: 'Job is not found.'
      });
    }

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`
    });
  }
}