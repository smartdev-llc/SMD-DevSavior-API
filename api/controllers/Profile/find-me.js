module.exports = async function (req, res) {
  const studentId = _.get(req, 'user.id');
  try {
    const profile = await Profile.findOne({ owner: studentId }, { owner: studentId })
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