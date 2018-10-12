module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const companyName = _.get(req, "user.name");
  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to create a new job."
    });
  }
  const { skillIds, title, description, categoryId, fromSalary, toSalary, jobRequirements } = req.body;

  if (!title || !categoryId || !description || !_.isNumber(toSalary) || !jobRequirements) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  const salary = salaryCoverted(res, fromSalary, toSalary);

  try {
    const job = await Job.create({
      company: companyId,
      title,
      description,
      category: categoryId,
      skills: skillIds,
      jobRequirements,
      fromSalary: salary.from,
      toSalary: salary.to
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

const salaryCoverted = (res, fromSalary, toSalary) => {
  const from = (_.isNumber(fromSalary) > 0) ? fromSalary : 0;
  const to = (_.isNumber(toSalary) > 0) ? toSalary : 0;

  if (from > to) {
    return res.badRequest({
      message: "TO must be greater than FROM"
    });
  }

  return convertedSalary = {
    from,
    to
  }
} 
