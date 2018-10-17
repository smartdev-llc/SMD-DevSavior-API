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

  const resumeBody = {
    jobTitle,
    yearsOfExperience,
    educationalStatus,
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