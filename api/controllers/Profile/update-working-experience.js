const { 
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
      message: "Working experience is not found."
    });
  }

  let workingExperience;
  try {
    workingExperience = await WorkingExperience.findOne({ id });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  if (!workingExperience) {
    return res.notFound({
      message: "Education degree is not found."
    })
  }

  if (workingExperience.studentProfile != userProfile.id) {
    return res.forbidden({
      message: "You cannot delete this working experience."
    });
  }

  const {
    jobTitle, company, additionalInformation
  } = req.body;

  let fromMonth = req.body.fromMonth || workingExperience.fromMonth;
  let toMonth = req.body.toMonth || workingExperience.toMonth;

  if (jobTitle == "" || company == "") {
    return res.badRequest({
      message: "Invalid parameters (`jobTitle`, `company` cannot be EMPTY string)."
    })
  }

  if (!isValidPeriodOfMonthYear(fromMonth, toMonth)) {
    return res.badRequest({
      message: "Invalid `fromMonth` and `toMonth` parameters (should be in format MM-YYYY and fromMonth <= toMonth)."
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
      message: "Something went wrong."
    });
  }
}