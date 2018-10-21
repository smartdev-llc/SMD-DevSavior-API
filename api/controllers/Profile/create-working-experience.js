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
    jobTitle, company, fromMonth, toMonth, additionalInformation
  } = req.body;

  if (!jobTitle || !company || !fromMonth ||  !toMonth) {
    return res.badRequest({
      message: "Missing parameters."
    });
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
    additionalInformation,
    studentProfile: userProfile.id
  };

  try {
    const workingExperience = await WorkingExperience.create(workingExperienceBody).fetch();
    res.ok(workingExperience);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
}