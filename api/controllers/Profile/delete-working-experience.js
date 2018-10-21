module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  let userProfile;

  try {
    userProfile = await Profile.findOne({ owner: userId });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  const {
    id
  } = req.params;

  if (!id) {
    return res.notFound({
      message: "Working experience is not found."
    });
  }

  let workingExperience;
  try {
    workingExperience = await WorkingExperience.findOne({ id });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  if (!workingExperience) {
    return res.notFound({
      message: "Education degree is not found."
    })
  }

  if (workingExperience.studentProfile != userProfile.id) {
    return res.forbidden({
      message: "You cannot delete this working experience."
    });
  }

  try {
    await WorkingExperience.destroy({ id });
    res.ok({
      message: "Working experience is deleted."
    })
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
}