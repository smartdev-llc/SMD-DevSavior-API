const { 
  isValidPeriodOfMonthYear
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  let userProfile;

  try {
    userProfile = await Profile.findOne({ owner: userId});
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  const {
    university, major, degreeType, degreeClassification, fromMonth, toMonth, additionalInformation
  } = req.body;

  if (!university || !major || !degreeType || !degreeClassification || !fromMonth ||  !toMonth) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!isValidPeriodOfMonthYear(fromMonth, toMonth)) {
    return res.badRequest({
      message: "Invalid `fromMonth` and `toMonth` parameters (should be in format MM-YYYY and fromMonth <= toMonth)."
    });
  }

  const educationDegreeBody = {
    university, 
    major, 
    degreeType, 
    degreeClassification, 
    fromMonth, 
    toMonth, 
    additionalInformation,
    studentProfile: userProfile.id
  };

  try {
    const educationDegree = await EducationDegree.create(educationDegreeBody).fetch();
    res.ok(educationDegree);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
}