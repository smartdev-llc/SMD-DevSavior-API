const { 
  isArrayOfStrings
} = require('../../../utils/validator');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');

  const {
    skills
  } = req.body;

  if (!isArrayOfStrings(skills)) {
    return res.badRequest({
      message: "Invalid `skills` parameter (should be an ARRAY of STRING)."
    });
  }

  const profileBody = {
    skills
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