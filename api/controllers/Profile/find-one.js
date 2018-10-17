const { STUDENT_PUBLIC_FIELDS } = require('../../../constants');

module.exports = async function (req, res) {
  const { studentId } = req.params;
  try {
    const profile = await Profile.findOne({ owner: studentId })
      .populate('owner')
      .populate('workingPreference')
      .populate('workingExperiences')
      .populate('educations');
      
    res.ok(profile);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    })
  }
}