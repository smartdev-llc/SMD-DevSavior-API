module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const companyName = _.get(req, "user.name");
  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to create a new job."
    });
  }
  const { skillIds, title, description, categoryId } = req.allParams();

  if (!title || !categoryId) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  try {
    const job = await Job.create({
      company: companyId,
      title,
      description,
      category: categoryId,
      skills: skillIds
    }).fetch();

    const category = await Category.findOne({ id: categoryId });
    const skills = await Skill.find({ id: skillIds });
    ElasticsearchService.create({
      type: 'Job',
      id: job.id,
      body: {
        company: {
          companyId,
          name: companyName
        },
        title,
        description,
        skills: _.map(skills, 'name'),
        category: category.name,
        status: job.status
      }
    });

    res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      data: err
    });
  }
};
