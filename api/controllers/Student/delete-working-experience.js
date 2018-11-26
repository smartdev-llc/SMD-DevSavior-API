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

  if (workingExperience.student !== userId) {
    return res.forbidden({
      message: "You have no permissions to do this action.",
      devMessage: "You are not the owner of this working experience.",
      code: PERMISSION_DENIED
    });
  }

  try {
    await WorkingExperience.destroy({ id });
    res.ok({
      message: "Working experience is deleted."
    })
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}