const { 
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
    jobTitle, company, fromMonth, toMonth, additionalInformation
  } = req.body;

  if (!jobTitle || !company || !fromMonth ||  !toMonth) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Some paramters are missing (`jobTitle` | `company` | `fromMonth` | `toMonth`).",
      code: MISSING_PARAMETERS
    });
  }

  if (!isValidPeriodOfMonthYear(fromMonth, toMonth)) {
    return res.badRequest({
      message: "Invalid paramters",
      devMessage: "Invalid `fromMonth` and `toMonth` parameters (should be in format MM-YYYY and fromMonth <= toMonth).",
      code: INVALID_PARAMETERS
    });
  }

  const workingExperienceBody = {
    jobTitle, 
    company,
    fromMonth, 
    toMonth, 
    additionalInformation,
    student: userId
  };

  try {
    const workingExperience = await WorkingExperience.create(workingExperienceBody).fetch();
    res.ok(workingExperience);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}