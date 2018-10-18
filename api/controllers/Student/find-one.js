let debuglog = require("debug")("jv:student:find-one");

module.exports = async function (req, res) {
  const { id } = req.params;
  try {
    const student = await Student.findOne({ id })
      .omit(["password"])
      .populate("skills");

    if (!student) {
      return res.notFound({
        message: 'Student is not found.'
      });
    }
    res.ok(student);
  } catch (err) {
    debuglog(err);
    return res.serverError({
      code: "SERVER_ERROR",
      message: "Something went wrong."
    })
  }
}