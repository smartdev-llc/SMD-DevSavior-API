const { isEmail } = require('validator');
const { 
  isValidPhoneNumber, 
  isValidDateOfBirth, 
  isValidGender,
  isValidMaritalStatus
} = require('../../../utils/validator');

const {
  INTERNAL_SERVER_ERROR,
  MISSING_PARAMETERS,
  INVALID_PARAMETERS
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    firstName,
    lastName,
    phoneNumber,
    displayEmail,
    dateOfBirth,
    gender,
    maritalStatus,
    country,
    city,
    currentAddress
  } = req.body;

  if (!firstName || !lastName || !phoneNumber || !displayEmail || !dateOfBirth || !gender || !maritalStatus || !country || !city || !currentAddress) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Some paramters are missing (`firstName` | `lastName` | `phoneNumber` | `displayEmail` | `dateOfBirth` | `gender` | `maritalStatus` | `country` | `city` | `currentAddress`).",
      code: MISSING_PARAMETERS
    });
  }

  if (!isEmail(displayEmail)) {
    return res.badRequest({
      message: "Invalid email.",
      devMessage: "Invalid email.",
      code: INVALID_PARAMETERS
    });
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    return res.badRequest({
      message: "Invalid phone number.",
      devMessage: "Invalid phone number.",
      code: INVALID_PARAMETERS
    })
  }

  if (!isValidDateOfBirth(dateOfBirth)) {
    return res.badRequest({
      message: "Invalid date of birth.",
      devMessage: "Invalid date of birth (should be in format DD-MM-YYYY).",
      code: INVALID_PARAMETERS
    })
  }

  if (!isValidGender(gender)) {
    return res.badRequest({
      message: "Invalid gender.",
      devMessage: "Invalid gender (should be MALE or FEMALE).",
      code: INVALID_PARAMETERS
    })
  }

  if (!isValidMaritalStatus(maritalStatus)) {
    return res.badRequest({
      message: "Invalid marital status.",
      devMessage: "Invalid marital status (should be SINGLE or MARRIED).",
      code: INVALID_PARAMETERS
    })
  }

  const profileBody = {
    firstName,
    lastName,
    displayName: `${lastName} ${firstName}`,
    phoneNumber,
    displayEmail,
    dateOfBirth,
    gender,
    maritalStatus,
    country,
    city,
    currentAddress
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