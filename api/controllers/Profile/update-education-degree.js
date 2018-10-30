const { 
  isValidDegreeType,
  isValidDegreeClassification,
  isValidPeriodOfMonthYear
} = require('../../../utils/validator');

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
      message: "You cannot update this education degree."
    });
  }

  const {
    university, major, degreeType, degreeClassification, additionalInformation
  } = req.body;

  let fromMonth = req.body.fromMonth || educationDegree.fromMonth;
  let toMonth = req.body.toMonth || educationDegree.toMonth;

  if (university == "" || major == "" || degreeType == "" || degreeClassification == "") {
    return res.badRequest({
      message: "Invalid parameters (`university`, `major`, `degreeType`, `degreeClassification` cannot be EMPTY string)."
    })
  }

  if (!isValidPeriodOfMonthYear(fromMonth, toMonth)) {
    return res.badRequest({
      message: "Invalid `fromMonth` and `toMonth` parameters (should be in format MM-YYYY and fromMonth <= toMonth).."
    });
  }

  if (!isValidDegreeType(degreeType)) {
    return res.badRequest({
      message: "Invalid `degreeType` parameter (should be one of these: HIGH_SCHOOL, COLLEGE, BACHELOR, MASTER, DOCTORATE, OTHER)."
    });
  }

  if (!isValidDegreeClassification(degreeClassification)) {
    return res.badRequest({
      message: "Invalid `degreeClassification` parameter (should be one of these: AVERAGE, GOOD, EXCELLENT)."
    });
  }

  const educationDegreeBody = {
    university, 
    major, 
    degreeType, 
    degreeClassification, 
    fromMonth, 
    toMonth, 
    additionalInformation
  };

  try {
    const updatedEDs = await EducationDegree.update({ id }, educationDegreeBody).fetch();
    res.ok(updatedEDs[0]);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
}