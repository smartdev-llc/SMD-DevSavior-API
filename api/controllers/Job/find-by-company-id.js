module.exports = async function (req, res) {
  const companyId = _.get(req, "params.companyId");

  if (!companyId) {
    return res.badRequest({
      message: "Missing parameter."
    });
  }

  try {
    const job = await Job
    .find({ company: companyId })
    .populate('skills', { select: ['id', 'name'] })
    .populate('category')
    .populate('company');;

    if (!_.size(job)) {
      return res.notFound({
        message: "Job not found."
      });
    }

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`
    });
  }

};
