const { 
  isValidSalary
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const companyName = _.get(req, "user.name");
  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to create a new job."
    });
  }
  const { skillIds, title, description, categoryId, fromSalary, toSalary, requirements } = req.body;

  if (!title || !categoryId || !description || !requirements) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!isValidSalary(fromSalary, toSalary)) {
    return res.badRequest({
      message: "Invalid Salary."
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
      toSalary
    }).fetch();

    const category = await Category.findOne({ id: categoryId });
    const skills = await Skill.find({ id: skillIds });
    ElasticsearchService.create({
      type: 'Job',
      id: job.id,
      body: {
        company: {
          id: companyId,
          name: companyName
        },
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
        toSalary: job.toSalary
      }
    });

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
};
