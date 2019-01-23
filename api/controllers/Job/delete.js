const {
  NOT_FOUND,
  FORBIDDEN_ACTION,
  MISSING_PARAMETERS,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

const destroyJob = (jobId) => {
  try {
    JobApplication.destroy({ job: jobId });
  } catch (err) {}

  try {
    JobSkill.destroy({ job: jobId });
  } catch (err) {}

  try {
    HotJob.destroy({ job: jobId });
  } catch (err) {}
};

const isPermission = (role) => {
  return role === "admin" || role === "company";
};

module.exports = async function (req, res) {
  const user = _.get(req, "user");
  const { id } = req.params;

  if (!isPermission(user.role)) {
    return res.forbidden({
      message: "You need to login as admin or company role.",
      devMessage: "You need to login as admin or company role",
      code: FORBIDDEN_ACTION
    });
  }
  if (!id || id === "undefined") {
    return res.badRequest({
      message: "JobId is missing.",
      devMessage: "JobId is missing.",
      code: MISSING_PARAMETERS
    });
  }

  try {
    const job = await Job.findOne({ id });

    if (!job) {
      return  res.notFound({
        message: "Job not found.",
        code: NOT_FOUND
      });
    }

    if (user.role === "company" && job.company !== user.id) {
      return  res.notFound({
        message: "Job not found.",
        code: NOT_FOUND
      });
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  try {
    await Job.destroyOne({ id });
    ElasticsearchService.delete({
      type: "Job",
      id
    });
    destroyJob(id);
    return res.ok({
      message: "Your job has been deleted!"
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
};
