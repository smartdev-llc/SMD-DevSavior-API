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
      return res.badRequest({
        message: "Cannot execute this action."
      });
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  try {
    const job = await Job.update({id})
    .set({description})
    .fetch();

    if (job) {
      return res.ok({
        message: "Update successfully."
      });
    } else {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
};
