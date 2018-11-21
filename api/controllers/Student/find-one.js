const {
  MISSING_PARAMETERS,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const { id } = req.params;
  if (!id) {
    return res.notFound({
      message: 'You should provide a student id.',
      devMessage: '`id` is missing.',
      code: MISSING_PARAMETERS
    })
  }
  try {
    const student = await Student.findOne({ id })
      .populate("profile");

    if (!student) {
      return res.notFound({
        message: 'Student is not found.',
        devMessage: 'Student is not found.',
        code: NOT_FOUND
      });
    }
    res.ok(student);
  } catch (err) {
    return res.serverError({
      code: INTERNAL_SERVER_ERROR,
      message: "Something went wrong.",
      devMessage: err.message
    })
  }
}