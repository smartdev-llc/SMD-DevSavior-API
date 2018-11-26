const {
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
    });
  }

  if (educationDegree.student !== userId) {
    return res.forbidden({
      message: "You have no permissions to do this action.",
      devMessage: "You are not the owner of this education degree.",
      code: PERMISSION_DENIED
    });
  }

  try {
    await EducationDegree.destroy({ id });
    res.ok({
      message: "Education degree is deleted."
    })
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}