module.exports = async function (req, res) {
  const companyId = _.get(req, 'user.id');
  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to create a new job."
    });
  }
  const { skillIds, title, description, categoryId } = req.allParams();

  if (!title || !categoryId) {
    return res.badRequest({
      message: "Missing parameters."
    })
  }

  try {
    const job = await Job.create({
      company: companyId,
      title,
      description,
      category: categoryId,
      skills: skillIds
    }).fetch();
    
    res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
}