module.exports = async function (req, res) {
  const { studentId } = req.params;
  try {
    const profile = await Profile.findOne({ owner: studentId })
      .populate('owner')
      .populate('workingPreference')
      .populate('workingExperiences')
      .populate('educationDegrees');

    if (!profile) {
      return res.notFound({
        message: 'Student profile is not found.'
      });
    }
    res.ok(profile);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    })
  }
}