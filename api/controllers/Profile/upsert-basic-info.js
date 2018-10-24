const { 
  isValidEducationalStatus
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    jobTitle,
    yearsOfExperience,
    educationalStatus
  } = req.body;

  if (!jobTitle || _.isNil(yearsOfExperience) || !educationalStatus) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!isValidEducationalStatus(educationalStatus)) {
    return res.badRequest({
      message: "Invalid educational status (should be FIRST_TO_THIRD_YEAR or FOURTH_YEAR or FINAL_YEAR or GRADUATED)."
    })
  }

  const profileBody = {
    jobTitle,
    yearsOfExperience,
    educationalStatus
  };

  try {
    const updatedProfiles = await Profile.update({ owner: userId }).set(profileBody).fetch();
    const userProfile = updatedProfiles[0];
    res.ok(userProfile);
  } catch(err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

}