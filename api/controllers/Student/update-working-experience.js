const { 
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
      message: "Working experience is not found.",
      devMessage: "Working experience is not found.",
      code: NOT_FOUND
    });
  }

  let workingExperience;
  try {
    workingExperience = await WorkingExperience.findOne({ id });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!workingExperience) {
    return res.notFound({
      message: "Working experience is not found.",
      devMessage: "Working experience is not found.",
      code: NOT_FOUND
    });
  }

  if (workingExperience.student != userId) {
    return res.forbidden({
      message: "You have no permissions to do this action.",
      devMessage: "You are not the owner of this working experience.",
      code: PERMISSION_DENIED
    });
  }

  const {
    jobTitle, company, additionalInformation
  } = req.body;

  let fromMonth = req.body.fromMonth || workingExperience.fromMonth;
  let toMonth = req.body.toMonth || workingExperience.toMonth;

  if (jobTitle == "" || company == "") {
    return res.badRequest({
      message: "Invalid paramters.",
      devMessage: "Invalid parameters (`jobTitle`, `company` cannot be EMPTY string).",
      code: INVALID_PARAMETERS
    })
  }

  if (!isValidPeriodOfMonthYear(fromMonth, toMonth)) {
    return res.badRequest({
      message: "Invalid paramters.",
      message: "Invalid `fromMonth` and `toMonth` parameters (should be in format MM-YYYY and fromMonth <= toMonth).",
      code: INVALID_PARAMETERS
    });
  }

  const workingExperienceBody = {
    jobTitle, 
    company,
    fromMonth, 
    toMonth, 
    additionalInformation
  };

  try {
    const updatedWEs = await WorkingExperience.update({ id }, workingExperienceBody).fetch();
    res.ok(updatedWEs[0]);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}