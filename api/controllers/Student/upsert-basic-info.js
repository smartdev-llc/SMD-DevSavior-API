const { 
  isValidEducationalStatus
} = require('../../../utils/validator');

const {
  INTERNAL_SERVER_ERROR,
  MISSING_PARAMETERS,
  INVALID_PARAMETERS
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    jobTitle,
    yearsOfExperience,
    educationalStatus
  } = req.body;

  if (!jobTitle || _.isNil(yearsOfExperience) || !educationalStatus) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Some paramters are missing (`jobTitle` | `yearsOfExperience` | `educationalStatus`).",
      code: MISSING_PARAMETERS
    });
  }

  if (!isValidEducationalStatus(educationalStatus)) {
    return res.badRequest({
      message: "Invalid paramters",
      devMessage: "Invalid educational status (should be FIRST_TO_THIRD_YEAR or FOURTH_YEAR or FINAL_YEAR or GRADUATED).",
      code: INVALID_PARAMETERS
    })
  }

  const profileBody = {
    jobTitle,
    yearsOfExperience,
    educationalStatus
  };

  try {
    const userProfile = await Student.updateOne({ id: userId }).set(profileBody);
    res.ok(userProfile);
  } catch(err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

}