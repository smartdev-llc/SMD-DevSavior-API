const { COMPANY_PUBLIC_FIELDS } = require('../../../constants');
module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");

  if (userId && role == 'company') {
    await findByCompanyId(req, res, userId);
  } else {
    await findAll(req, res);
  }
}

const findByCompanyId = async (req, res, userId) => {
  try {
    const job = await Job
      .find({ company: userId })
      .populate('students', { select: ['id', 'firstName', 'lastName'] })
      .populate('skills', { select: ['id', 'name'] })
      .populate('category')
      .populate('company');

    if (!job) {
      return res.badRequest({
        message: 'Job is not found'
      });
    }

    return res.ok(job);
  } catch (err) {
    console.log(err);
    return res.serverError({
      message: `Something went wrong .`
    });
  }
}

const findAll = async (req, res) => {
  try {
    const jobs = await Job
      .find({})
      .populate('students', { select: ['id', 'firstName', 'lastName'] })
      .populate('skills', { select: ['id', 'name'] })
      .populate('category')
      .populate('company');

    const jobConverted = _.map(jobs, job => {
      const numberOfCandidates = _.size(_.get(job, 'students'))
      job.numberOfCandidates = numberOfCandidates
      return _.omit(job, ['students']);;
    })
    return res.ok(jobConverted);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`
    });
  }
}