const { 
  isValidLanguagesObject
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    languages
  } = req.body;

  if (!isValidLanguagesObject(languages)) {
    return res.badRequest({
      message: "Invalid `languages` parameter (should be an OBJECT with full of languages and levels: { ENGLISH: 'BEGINNER', SPANISH: 'NO', JAPANESE: 'INTERMEDIATE', CHINESE: 'ADVANCED', GERMAN: 'NATIVE', ... })."
    });
  }

  const profileBody = {
    languages
  };

  try {
    const updatedProfiles = await Profile.update({ owner: userId }).set(profileBody).fetch();
    const userProfile = updatedProfiles[0];
    res.ok(userProfile);
  } catch(err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
}