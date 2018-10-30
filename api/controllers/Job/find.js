const { COMPANY_PUBLIC_FIELDS } = require('../../../constants');
module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");
  const { size, page } = _.get(req, 'query');
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;

  if (userId && role == 'company') {
    await findByCompanyId(req, res, userId, limit, skip);
  } else {
    await findAll(req, res, limit, skip);
  }
}

const findByCompanyId = async (req, res, userId, limit, skip) => {
  try {
    const job = await Job
      .find({ company: userId })
      .populate('students', { select: ['id', 'firstName', 'lastName'] })
      .populate('skills', { select: ['id', 'name'] })
      .populate('category')
      .populate('company')
      .limit(limit)
      .skip(skip);

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

const findAll = async (req, res, limit, skip) => {
  try {
    const jobs = await Job
      .find({})
      .populate('students', { select: ['id', 'firstName', 'lastName'] })
      .populate('skills', { select: ['id', 'name'] })
      .populate('category')
      .populate('company')
      .limit(limit)
      .skip(skip);

    const jobConverted = _.map(jobs, job => {
      job.numberOfCandidates = _.size(_.get(job, 'students'))
      return _.omit(job, ['students']);;
    })
    return res.ok(jobConverted);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`
    });
  }
}