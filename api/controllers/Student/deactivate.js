
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CANNOT_EXECUTE_ACTION,
  MISSING_PARAMETERS
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { INACTIVE } = constants.STATUS;


module.exports = async function (req, res) {
  const { id } = _.get(req, "params");

  if (!id) {
    return res.notFound({
      message: 'Student is not found.',
      devMessage: 'Student is not found.',
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
      message: 'Student is not found.',
      devMessage: 'Student is not found.',
      code: NOT_FOUND
    });
  }

  if (student.status === INACTIVE) {
    return res.badRequest({
      message: 'Cannot execute this action. Student is inactive.',
      devMessage: 'Student status is inactive.',
      code: CANNOT_EXECUTE_ACTION
    });
  }

  try {

    const updatedBody = {
      status: INACTIVE
    };

    const updatedJob = await Student.updateOne({ id })
      .set(updatedBody);

    return res.ok(updatedJob);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
};
