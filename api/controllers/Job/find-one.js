const { COMPANY_PUBLIC_FIELDS } = require('../../../constants');

module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");
  const id = _.get(req, "params.id");

  if (userId && role == 'company') {
    await findOneByCompanyId(req, res, userId, id);
  } else {
    await findOne(req, res, userId, id);
  }
}

const findOneByCompanyId = async (req, res, userId, id) => {
  try {
    const job = await Job
      .findOne({ id, company: userId })
      .populate('company')
      .populate('students', { select: ['id', 'firstName', 'lastName'] })
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
      message: `Something went wrong .${err}`
    });
  }
}

const findOne = async (req, res, userId, id) => {
  let job;
  let isApplied;
  try {
    job = await Job
      .findOne({ id })
      .populate('company')
      .populate('skills', { select: ['id', 'name'] })
      .populate('category');

    if (!job) {
      return res.notFound({
        message: 'Job is not found.'
      });
    }

  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`
    });
  }

  try {
    const jobApplication = await JobApplication
      .findOne({ student: !!userId ? userId : null, job: id });
      
    if (!jobApplication) {
      isApplied = false;
    } else {
      isApplied = true;
    }

  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`
    });
  }
  job.isApplied = isApplied;
  return res.ok(job);

}