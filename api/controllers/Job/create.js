const moment = require('moment');

const { 
  isValidSalary,
  isValidJobType
} = require('../../../utils/validator');

const {
  INVALID_PARAMETERS,
  MISSING_PARAMETERS,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const company = _.get(req, "user");

  const { skillIds, title, description, categoryId, fromSalary, toSalary, requirements, jobType, benefits } = req.body;
  const expiredAt = moment().add(sails.config.custom.jobDuration || 7, 'days').valueOf();

  if (!title || !categoryId || !description || !requirements || !jobType) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Some parameters are missing (`title` | `categoryId` | `description` | `requirements` | `jobType`).",
      code: MISSING_PARAMETERS
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
    const job = await Job.create({
      company: companyId,
      title,
      description,
      category: categoryId,
      skills: skillIds,
      requirements,
      fromSalary,
      toSalary,
      jobType,
      benefits,
      expiredAt
    }).fetch();

    const category = await Category.findOne({ id: categoryId });
    const skills = await Skill.find({ id: skillIds });
    ElasticsearchService.create({
      type: 'Job',
      id: job.id,
      body: {
        company: company,
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
        expiredAt: job.expiredAt
      }
    });

    job.skills = skills;
    job.category = category;
    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
};
