const {
  BAD_REQUEST,
  NOT_FOUND
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.badRequest({
        code: BAD_REQUEST,
        message: "Id is required"
      });
    }
    const hotjob = await HotJob
      .findOne({ slug })
      .populate("job")
      .populate("company");

    return hotjob ? res.ok(hotjob) : res.notFound({
      code: NOT_FOUND,
      message: "Job not found."
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      code: "INTERNAL_SERVER_ERROR",
      error: err.stack
    });
  }
};
