const { 
  isValidSalary,
  isValidJobType
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  let userCV;

  try {
    userCV = await Resume.findOrCreate({ student: userId}, { student: userId });
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

  let expectedSalaryFrom = 0, expectedSalaryTo = 0;

  if (!preferredWorkingLocation || !_.isBoolean(willingToRelocate) || !_.isBoolean(isNegotiableSalary) || !jobType || !careerObjectives) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!isValidJobType(jobType)) {
    return res.badRequest({
      message: "Invalid job type (should be FULL_TIME or PART_TIME or INTERNSHIP."
    });
  }

  if (!_.isArray(careerObjectives)) {
    return res.badRequest({
      message: "Invalid careerObjectives (should be an ARRAY)."
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
  }

  const workingPreferenceBody = {
    preferredWorkingLocation,
    willingToRelocate,
    expectedSalaryFrom,
    expectedSalaryTo,
    jobType,
    careerObjectives,
    studentCV: userCV.id
  }

  try {
    const existingWorkingPreference = await WorkingPreference.findOne({ studentCV: userCV.id });
    let workingPreference;
    if (!existingWorkingPreference) {
      workingPreference = await WorkingPreference.create(workingPreferenceBody);
    } else {
      updatedorkingPreferences = await WorkingPreference.update({ studentCV: userCV.id }).set(workingPreferenceBody).fetch();
      workingPreference = updatedorkingPreferences[0];
    }

    res.ok(workingPreference);
  } catch (err) {
    console.log(err);
    return res.serverError({
      message: "Something went wrong."
    });
  }
}