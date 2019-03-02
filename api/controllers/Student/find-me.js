const {
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  try {
    const profile = await Student.findOne({ id: userId })
      .populate('workingPreference')
      .populate('workingExperiences')
      .populate('educationDegrees');

    res.ok(profile);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
}