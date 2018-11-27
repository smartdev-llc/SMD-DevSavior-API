const { STATUS } = require("../../../constants");

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const id = _.get(req, "params.id");
  const updateParams = _.pick(req.body, ["status"]);
  if (_.isEmpty(updateParams)) {
    return res.badRequest({
      code: "BAD_REQUEST",
      message: "Request body must be not empty."
    });
  }

  try {
    const job = await Job.findOne({
      id,
      company: companyId,
    });

    if (!job) {
      return res.notFound({
        code: "NOT_FOUND",
        message: "Job not found."
      });
    }

    

    const updatedJob = await Job.updateOne({ id })
      .set(updateParams)

    ElasticsearchService.update({
      type: 'Job',
      id: job.id,
      body: {
        doc: updateParams
      }
    });

    return res.ok(updatedJob);
  } catch (err) {
    return res.serverError({
      code: "INTERNAL",
      message: `Something went wrong.`,
      data: err
    });
  }
};
