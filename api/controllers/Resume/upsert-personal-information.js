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

  const resumeBody = {
    fullName,
    phoneNumber,
    email,
    dateOfBirth,
    gender,
    maritalStatus,
    country,
    city,
    currentAddress,
    student: userId
  };

  try {
    const existingCV = await Resume.findOne({ student: userId });
    let userCV;
    if (!existingCV) {
      userCV = await Resume.create(resumeBody);
    } else {
      const updatedCVs = await Resume.update({ student: userId }).set(resumeBody).fetch();
      userCV = updatedCVs[0];
    }
    res.ok(userCV);
  } catch(err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

}