const { 
  isValidSalary,
  isValidJobType
} = require('../../../utils/validator');

const {
  INTERNAL_SERVER_ERROR,
  MISSING_PARAMETERS,
  INVALID_PARAMETERS
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

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
      message: "Missing parameters.",
      devMessage: "Some parameters are missing (`preferredWorkingLocation` | `willingToRelocate` | `isNegotiableSalary` | `jobType` | `careerObjectives`).",
      code: MISSING_PARAMETERS
    });
  }

  if (!isValidJobType(jobType)) {
    return res.badRequest({
      message: "Invalid job type.",
      devMessage: "Invalid job type (should be FULL_TIME or PART_TIME or INTERNSHIP or CONTRACT or FREELANCE.",
      code: INVALID_PARAMETERS
    });
  }

  if (!_.isString(careerObjectives)) {
    return res.badRequest({
      message: "Invalid career objectives.",
      devMessage: "Invalid careerObjectives (should be a STRING).",
      code: INVALID_PARAMETERS
    });
  }

  if (!isNegotiableSalary) {
    expectedSalaryFrom = req.body.expectedSalaryFrom;
    expectedSalaryTo = req.body.expectedSalaryTo;

    if (!expectedSalaryFrom || !expectedSalaryTo) {
      return res.badRequest({
        message: "Missing parameters.",
        devMessage: "Some parameters are missing (`expectedSalaryFrom` | `expectedSalaryTo`).",
        code: MISSING_PARAMETERS
      });
    }

    if (!isValidSalary(expectedSalaryFrom, expectedSalaryTo)) {
      return res.badRequest({
        message: "Invalid salary.",
        devMessage: "Invalid salary (should be NUMBER and FROM <= TO).",
        code: INVALID_PARAMETERS
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
    student: userId
  }

  try {
    const existingWorkingPreference = await WorkingPreference.findOne({ student: userId });
    let workingPreference;
    if (!existingWorkingPreference) {
      workingPreference = await WorkingPreference.create(workingPreferenceBody).fetch();
    } else {
      updatedWorkingPreferences = await WorkingPreference.update({ student: userId }).set(workingPreferenceBody).fetch();
      workingPreference = updatedWorkingPreferences[0];
    }

    res.ok(workingPreference);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}