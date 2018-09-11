module.exports = async function(req, res) {
  try {
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
    
    const job = await Job.create({
      company: companyId,
      title,
      description,
      category: categoryId,
      skills: skillIds
    }).fetch();
  
    if (!job) {
      return res.serverError({
        message: 'Cannot create job.'
      });
    }

    res.ok(job);
  } catch (err) {
    res.serverError(err);
  }
}