const { 
  isValidDegreeType,
  isValidDegreeClassification,
  isValidPeriodOfMonthYear
} = require('../../../utils/validator');

const {
  INVALID_PARAMETERS,
  PERMISSION_DENIED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  
  const {
    id
  } = req.params;

  if (!id) {
    return res.notFound({
      message: "Education degree is not found.",
      devMessage: "Education degree is not found.",
      code: NOT_FOUND
    });
  }

  let educationDegree;
  try {
    educationDegree = await EducationDegree.findOne({ id });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!educationDegree) {
    return res.notFound({
      message: "Education degree is not found.",
      devMessage: "Education degree is not found.",
      code: NOT_FOUND
    })
  }

  if (educationDegree.student != userId) {
    return res.forbidden({
      message: "You have no permissions to do this action.",
      devMessage: "You are not the owner of this education degree.",
      code: PERMISSION_DENIED
    });
  }

  const {
    university, major, degreeType, degreeClassification, additionalInformation
  } = req.body;

  let fromMonth = req.body.fromMonth || educationDegree.fromMonth;
  let toMonth = req.body.toMonth || educationDegree.toMonth;

  if (university == "" || major == "" || degreeType == "" || degreeClassification == "") {
    return res.badRequest({
      message: "Invalid parameters.",
      devMessage: "Invalid parameters (`university`, `major`, `degreeType`, `degreeClassification` cannot be EMPTY).",
      code: INVALID_PARAMETERS
    })
  }

  if (!isValidPeriodOfMonthYear(fromMonth, toMonth)) {
    return res.badRequest({
      message: "Invalid parameters.",
      devMessage: "Invalid `fromMonth` and `toMonth` parameters (should be in format MM-YYYY and fromMonth <= toMonth)..",
      code: INVALID_PARAMETERS
    });
  }

  if (!isValidDegreeType(degreeType)) {
    return res.badRequest({
      message: "Invalid parameters.",
      devMessage: "Invalid `degreeType` parameter (should be one of these: HIGH_SCHOOL, COLLEGE, BACHELOR, MASTER, DOCTORATE, OTHER).",
      code: INVALID_PARAMETERSs
    });
  }

  if (!isValidDegreeClassification(degreeClassification)) {
    return res.badRequest({
      message: "Invalid parameters.",
      message: "Invalid `degreeClassification` parameter (should be one of these: AVERAGE, GOOD, EXCELLENT).",
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
    additionalInformation
  };

  try {
    const updatedED = await EducationDegree.updateOne({ id }, educationDegreeBody);
    res.ok(updatedED);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}