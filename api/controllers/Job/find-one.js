const constants = require('../../../constants');
const { ACTIVE } = constants.STATUS;

const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = require('../../../constants/error-code');

const moment = require('moment');

module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");
  const slug = _.get(req, "params.slug");

  if (!slug || slug === 'undefined') {
    return res.notFound({
      message: 'Job is not found.',
      devMessage: 'Job is not found.',
      code: NOT_FOUND
    });
  }

  let condition = {
    slug
  }

  if (userId) {
    if (role === 'company') {
      condition.company = userId;
    } else if (role !== 'admin') {
      condition.status = ACTIVE;
      condition.expiredAt = {
        '>=': moment.now()
      };
    }
  } else {
    condition.status = ACTIVE;
    condition.expiredAt = {
      '>=': moment.now()
    };
  }

  let job;

  try {
    if (role === 'company' || role === 'admin') {
      job = await Job
        .findOne(condition)
        .populate('company')
        .populate('students', { select: ['id', 'firstName', 'lastName'] })
        .populate('skills', { select: ['id', 'name'] })
        .populate('category');
    } else {
      job = await Job
        .findOne(condition)
        .populate('company')
        .populate('skills', { select: ['id', 'name'] })
        .populate('category');
    }

    if (!job) {
      return res.notFound({
        message: 'Job is not found.',
        devMessage: 'Job is not found.',
        code: NOT_FOUND
      });
    }

    if (role === 'student') {
      try {
        const application = await JobApplication.findOne({ student: userId, job: job.id });
        job.isApplied = !!application;
      } catch (err) {
        return res.serverError({
          message: "Something went wrong.",
          devMessage: err.message,
          code: INTERNAL_SERVER_ERROR
        });
      }
    }

    try {
      const company = await CompanyReview.find({ company: job.company.id }).populate("student");
      reviews = _.map(company, value =>  _.pick(value, ['student.id', 'student.firstName', 'student.lastName', "comment", "stars"]));
      job.company.reviews = reviews;
    } catch (err) {
      return res.serverError({
        message: "Something went wrong.",
        devMessage: err.message,
        code: INTERNAL_SERVER_ERROR
      });
    }

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}