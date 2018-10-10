module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const companyName = _.get(req, "user.name");
  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to create a new job."
    });
  }
  const { skillIds, title, description, categoryId, salary, jobRequirements } = req.body;

  if (!title || !categoryId || !description || !salary || !jobRequirements) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  const from = (!!_.get(salary, "from") && _.get(salary, "from") > 0) ? _.get(salary, "from") : 0;
  const to = _.get(salary, "to") || 0;

  if (!_.isNumber(from) || !_.isNumber(to) || from >= to) {
    return res.badRequest({
      message: "TO must be greater than FROM"
    });
  }

  var convertedSalary = {
    from,
    to
  }

  try {
    const job = await Job.create({
      company: companyId,
      title,
      description,
      category: categoryId,
      skills: skillIds,
      jobRequirements,
      salary: convertedSalary
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
        jobRequirements: job.jobRequirements,
        salary: job.salary
      }
    });

    res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
};
