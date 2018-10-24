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
      message: "Education degree is not found."
    });
  }

  let educationDegree;
  try {
    educationDegree = await EducationDegree.findOne({ id });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  if (!educationDegree) {
    return res.notFound({
      message: "Education degree is not found."
    })
  }

  if (educationDegree.studentProfile != userProfile.id) {
    return res.forbidden({
      message: "You cannot delete this education degree."
    });
  }

  try {
    await EducationDegree.destroy({ id });
    res.ok({
      message: "Education degree is deleted."
    })
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
}