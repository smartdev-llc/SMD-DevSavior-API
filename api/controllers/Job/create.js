const { 
  isValidSalary,
  isValidJobType
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const company = _.get(req, "user", {});

  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to create a new job."
    });
  }
  const { skillIds, title, description, categoryId, fromSalary, toSalary, requirements, jobType, benefits } = req.body;

  if (!title || !categoryId || !description || !requirements || !jobType) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!isValidSalary(fromSalary, toSalary)) {
    return res.badRequest({
      message: "Invalid Salary."
    });
  }

  if (!isValidJobType(jobType)) {
    return res.badRequest({
      message: "Invalid job type (should be FULL_TIME or PART_TIME or INTERNSHIP or CONTRACT or FREELANCE."
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
      benefits
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
        benefits: job.benefits
      }
    });

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
};
