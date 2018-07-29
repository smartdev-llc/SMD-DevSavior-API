/**
 * 
 * TODO: 
 * desciption: only get companyId from body now, wait for login case finish -> change companyId to req.user.id
 * 
 */

module.exports = async function(req, res) {
  try {
    let { skillIds, title, description, status, categoryId, companyId } = req.allParams();

    const job = await Job.create({
      company: companyId,
      title,
      description,
      status,
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
    res.serverError({err})
  }
}