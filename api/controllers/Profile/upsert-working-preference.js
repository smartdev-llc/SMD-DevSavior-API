const { 
  isValidSalary,
  isValidJobType
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
    preferredWorkingLocation,
    willingToRelocate,
    isNegotiableSalary,
    jobType,
    careerObjectives
  } = req.body;

  let expectedSalaryFrom, expectedSalaryTo;

  if (!preferredWorkingLocation || !_.isBoolean(willingToRelocate) || !_.isBoolean(isNegotiableSalary) || !jobType || !careerObjectives) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!isValidJobType(jobType)) {
    return res.badRequest({
      message: "Invalid job type (should be FULL_TIME or PART_TIME or INTERNSHIP or CONTRACT or FREELANCE."
    });
  }

  if (!_.isString(careerObjectives)) {
    return res.badRequest({
      message: "Invalid careerObjectives (should be a STRING)."
    });
  }

  if (!isNegotiableSalary) {
    expectedSalaryFrom = req.body.expectedSalaryFrom;
    expectedSalaryTo = req.body.expectedSalaryTo;

    if (!expectedSalaryFrom || !expectedSalaryTo) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }

    if (!isValidSalary(expectedSalaryFrom, expectedSalaryTo)) {
      return res.badRequest({
        message: "Invalid salary (should be NUMBER and FROM <= TO)."
      });
    }
  } else {
    expectedSalaryFrom = 0;
    expectedSalaryTo = 0;
  }

  const workingPreferenceBody = {
    preferredWorkingLocation,
    willingToRelocate,
    expectedSalaryFrom,
    expectedSalaryTo,
    isNegotiableSalary,
    jobType,
    careerObjectives,
    studentProfile: userProfile.id
  }

  try {
    const existingWorkingPreference = await WorkingPreference.findOne({ studentProfile: userProfile.id });
    let workingPreference;
    if (!existingWorkingPreference) {
      workingPreference = await WorkingPreference.create(workingPreferenceBody).fetch();
    } else {
      updatedWorkingPreferences = await WorkingPreference.update({ studentProfile: userProfile.id }).set(workingPreferenceBody).fetch();
      workingPreference = updatedWorkingPreferences[0];
    }

    res.ok(workingPreference);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
}