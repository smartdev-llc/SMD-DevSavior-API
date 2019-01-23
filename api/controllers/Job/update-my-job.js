const {
  isValidSalary,
  isValidJobType
} = require('../../../utils/validator');

const {
  INVALID_PARAMETERS,
  MISSING_PARAMETERS,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { ACTIVE, PENDING } = constants.STATUS;

const moment = require('moment');

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const id = _.get(req, "params.id");
  const {
    skillIds,
    title,
    description,
    categoryId,
    fromSalary,
    toSalary,
    requirements,
    jobType,
    benefits
  } = req.body;

  if (!description || !fromSalary || !toSalary || !requirements || !jobType || !benefits || !skillIds || !title || !categoryId) {
    return res.badRequest({
      message: MISSING_PARAMETERS
    });
  }

  if (!isValidSalary(fromSalary, toSalary)) {
    return res.badRequest({
      message: "Invalid Salary.",
      devMessage: "Invalid `fromSalary` and `toSalary` (they should be NUMBERIC, `fromSalary` <= `toSalary`).",
      code: INVALID_PARAMETERS
    });
  }

  if (!isValidJobType(jobType)) {
    return res.badRequest({
      message: "Invalid job type",
      devMessage: "Invalid job type (should be FULL_TIME or PART_TIME or INTERNSHIP or CONTRACT or FREELANCE.",
      code: INVALID_PARAMETERS
    });
  }

  try {
    const job = await Job.findOne({
      id,
      company: companyId,
    });

    if (!job) {
      return res.notFound({
        message: "Job not found."
      });
    }

    if (_.indexOf([ACTIVE, PENDING], job.status) < 0) {
      return res.badRequest({
        message: "Invalid job status",
        devMessage: "Invalid job status (should be ACTIVE or PENDING).",
        code: BAD_REQUEST
      });
    }

    if (job.expiredAt < moment.now()) {
      return res.badRequest({
        message: "Invalid job.",
        devMessage: "Job is expired.",
        code: INVALID_PARAMETERS
      });
    }
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  const updatedBody = {
    title,
    description,
    category: categoryId,
    skills: skillIds,
    requirements,
    fromSalary,
    toSalary,
    jobType,
    benefits,
  };

  try {
    let job = await Job.updateOne({ id })
      .set(updatedBody);

    const skills = await Skill.find({ id: skillIds });
    const category = await Category.findOne({ id: categoryId });

    ElasticsearchService.update({
      type: 'Job',
      id: id,
      body: {
        doc: {
          title,
          description,
          skills: _.map(skills, skill => _.pick(skill, ['name', 'id'])),
          category: {
            id: category.id,
            name: category.name
          },
          status: job.status,
          requirements: job.requirements,
          fromSalary: job.fromSalary,
          toSalary: job.toSalary,
          jobType: job.jobType,
          benefits: job.benefits,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        }
      }
    });

    job.skills = skills;
    job.category = category;

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
};
