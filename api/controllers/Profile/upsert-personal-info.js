const { isEmail } = require('validator');
const { 
  isValidPhoneNumber, 
  isValidDateOfBirth, 
  isValidGender,
  isValidMaritalStatus
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    fullName,
    phoneNumber,
    email,
    dateOfBirth,
    gender,
    maritalStatus,
    country,
    city,
    currentAddress
  } = req.body;

  if (!fullName || !phoneNumber || !email || !dateOfBirth || !gender || !maritalStatus || !country || !city || !currentAddress) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!isEmail(email)) {
    return res.badRequest({
      message: "Invalid email."
    });
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    return res.badRequest({
      message: "Invalid phone number."
    })
  }

  if (!isValidDateOfBirth(dateOfBirth)) {
    return res.badRequest({
      message: "Invalid date of birth (should be in format DD-MM-YYYY)."
    })
  }

  if (!isValidGender(gender)) {
    return res.badRequest({
      message: "Invalid gender (should be MALE or FEMALE)."
    })
  }

  if (!isValidMaritalStatus(maritalStatus)) {
    return res.badRequest({
      message: "Invalid marital status (should be SINGLE or MARRIED)."
    })
  }

  const profileBody = {
    fullName,
    phoneNumber,
    email,
    dateOfBirth,
    gender,
    maritalStatus,
    country,
    city,
    currentAddress
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