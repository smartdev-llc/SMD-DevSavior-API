module.exports = async function(req, res) {
  try {
    // TODO: only get companyId from body now, wait for login case finish -> change companyId to req.user.id
    const { skillIds, title, description, categoryId, companyId } = req.allParams();

    const job = await Job.create({
      company: companyId,
      title,
      description,
      category: categoryId,
      skills: skillIds
    }).fetch();
  
    if (!job) {
      return res.serverError({
        err: 'could not create Job model'
      })
    }

    res.ok(job);
  } catch (err) {
    res.serverError({err});
  }
}