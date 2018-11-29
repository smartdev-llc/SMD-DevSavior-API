const {
  INVALID_PARAMETERS,
  MISSING_PARAMETERS,
  ALREADY_SUBSCRIBED,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  const { skillId } = req.params;

  if (!skillId || skillId === 'undefined') {
    return res.badRequest({
      message: "Skill is missing.",
      devMessage: "`Skillid` is missing.",
      code: MISSING_PARAMETERS
    });
  }

  let skill;
  try {
    skill = await Skill.findOne({ id: skillId });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }

  if (!skill) {
    return res.badRequest({
      message: "Invalid skill.",
      devMessage: "Invalid skill id, can not found.",
      code: INVALID_PARAMETERS
    });
  }

  try {
    const existesSubscription = await SkillSubscription.findOne({ student: userId, skill: skillId });

    if (existesSubscription) {
      return res.conflict({
        message: "You have already subscribed this skill.",
        devMessage: "You have already subscribed this skill.",
        code: ALREADY_SUBSCRIBED
      })
    } else {
      await Student.addToCollection(userId, 'subscribedSkills').members([skillId]);
      const currentUser = await Student.findOne({ id: userId }).populate('subscribedSkills');
      res.ok({
        message: "Subscribed " + skill.name + ".",
        data: _.pick(currentUser, 'subscribedSkills')
      })
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
}