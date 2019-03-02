const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const { studentId } = req.params;
  try {
    const profile = await Student.findOne({ id: studentId })
      .populate('workingPreference')
      .populate('workingExperiences')
      .populate('educationDegrees');

    if (!profile) {
      return res.notFound({
        message: 'Student profile is not found.',
        devMessage: 'Student profile is not found.',
        code: NOT_FOUND
      });
    }
    res.ok(profile);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
}