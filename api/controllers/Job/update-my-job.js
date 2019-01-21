module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const id = _.get(req, "params.id");
  const { description } = req.body;

  if (!description) {
    return res.badRequest({
      message: "Missing parameter."
    });
  }

  try {
    const job = await Job.findOne({
      id,
      company: companyId,
    });

    if (!job) {
      return res.notFound({
        message: "Job not found."
      });
    }
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`
    });
  }

  try {
    const updateJob = await Job.updateOne({id})
    .set({description});

      return res.ok(updateJob);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`
    });
  }
};
