const { 
  isArrayOfStrings
} = require('../../../utils/validator');

const {
  INTERNAL_SERVER_ERROR,
  INVALID_PARAMETERS
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    skills
  } = req.body;

  if (!isArrayOfStrings(skills)) {
    return res.badRequest({
      message: "Invalid paramters.",
      devMessage: "Invalid `skills` parameter (should be an ARRAY of STRING).",
      code: INVALID_PARAMETERS
    });
  }

  const profileBody = {
    skills
  };

  try {
    const userProfile = await Student.updateOne({ id: userId }).set(profileBody);
    res.ok(userProfile);
  } catch(err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}