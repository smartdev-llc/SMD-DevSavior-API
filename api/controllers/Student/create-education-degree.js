const {
  isValidDegreeType,
  isValidDegreeClassification,
  isValidPeriodOfMonthYear
} = require('../../../utils/validator');

const { 
  MISSING_PARAMETERS,
  INVALID_PARAMETERS,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    university, major, degreeType, degreeClassification, fromMonth, toMonth, additionalInformation
  } = req.body;

  if (!university || !major || !degreeType || !degreeClassification || !fromMonth ||  !toMonth) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Some paramters are missing (`university` | `major` | `degreeType` | `degreeClassification` | `fromMonth` | `toMonth`).",
      code: MISSING_PARAMETERS
    });
  }

  if (!isValidDegreeType(degreeType)) {
    return res.badRequest({
      message: "Invalid parameter.",
      devMessage: "Invalid `degreeType` parameter (should be one of these: HIGH_SCHOOL, COLLEGE, BACHELOR, MASTER, DOCTORATE, OTHER).",
      code: INVALID_PARAMETERS
    });
  }

  if (!isValidDegreeClassification(degreeClassification)) {
    return res.badRequest({
      message: "Invalid parameter.",
      devMessage: "Invalid `degreeClassification` parameter (should be one of these: AVERAGE, GOOD, EXCELLENT).",
      code: INVALID_PARAMETERS
    });
  }

  if (!isValidPeriodOfMonthYear(fromMonth, toMonth)) {
    return res.badRequest({
      message: "Invalid parameter.",
      devMessage: "Invalid `fromMonth` and `toMonth` parameters (should be in format MM-YYYY and fromMonth <= toMonth).",
      code: INVALID_PARAMETERS
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
    student: userId
  };

  try {
    const educationDegree = await EducationDegree.create(educationDegreeBody).fetch();
    res.ok(educationDegree);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}