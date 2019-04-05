
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require("../../../constants/error-code");

module.exports = async function (req, res) {
  const { id } = _.get(req, "params");

  if (!id) {
    return res.notFound({
      message: "Student is not found.",
      devMessage: "Student is not found.",
      code: NOT_FOUND
    });
  }

  let student;

  try {
    student = await Student.findOne({ id });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!student) {
    return res.notFound({
      message: "Student is not found.",
      devMessage: "Student is not found.",
      code: NOT_FOUND
    });
  }

  try {
    await Student.destroyOne({ id });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
  EducationDegree.destroy({ student: id });
  WorkingExperience.destroy({ student: id });
  WorkingPreference.destroy({ student: id });
  JobApplication.destroy({ student: id });
  SkillSubscription.destroy({ student: id });
  CompanyReview.destroy({ student: id });

  return res.ok({
    message: "The student is deleted."
  });
};
