module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");

  if (!companyId) {
    return res.unauthorized({
      message: "You need login as a company to find jobs."
    });
  }

  try {
    const job = await Job
                        .find({company: companyId})
                        .populate('students', {select: ['id', 'firstName', 'lastName'] })
                        .populate('category');

    if (!job) {
      return res.badRequest({
        message: 'Job is not found'
      });
    }
    res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong. ${err}`
    });
  }
}