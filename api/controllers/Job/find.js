module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");
  const criteria = role == "company" ? { company: userId } : {};

  try {
    const job = await Job
      .find(criteria)
      .populate('students', { select: ['id', 'firstName', 'lastName'] })
      .populate('skills', { select: ['id', 'name'] })
      .populate('category');

    if (!job) {
      return res.badRequest({
        message: 'Job is not found'
      });
    }
    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong. ${err}`
    });
  }
}