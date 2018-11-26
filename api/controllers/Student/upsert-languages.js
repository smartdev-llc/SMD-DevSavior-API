const { 
  isValidLanguagesObject
} = require('../../../utils/validator');

const {
  INTERNAL_SERVER_ERROR,
  INVALID_PARAMETERS
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    languages
  } = req.body;

  if (!isValidLanguagesObject(languages)) {
    return res.badRequest({
      message: "Invalid parameters.",
      devMessage: "Invalid `languages` parameter (should be an OBJECT with full of languages and levels: { ENGLISH: 'BEGINNER', SPANISH: 'NO', JAPANESE: 'INTERMEDIATE', CHINESE: 'ADVANCED', GERMAN: 'NATIVE', ... }).",
      code: INVALID_PARAMETERS
    });
  }

  const profileBody = {
    languages
  };

  try {
    const updatedProfiles = await Student.update({ id: userId }).set(profileBody).fetch();
    const userProfile = updatedProfiles[0];
    res.ok(userProfile);
  } catch(err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}