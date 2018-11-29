const {
  INVALID_PARAMETERS,
  FORBIDDEN_ACTION,
  MISSING_PARAMETERS,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  const { skillId } = req.params;

  if (!skillId || skillId === 'undefined') {
    return res.badRequest({
      message: "Skill is missing.",
      devMessage: "`Skillid` is empty.",
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
    const existedSubscription = await SkillSubscription.findOne({ student: userId, skill: skillId });

    if (existedSubscription) {
      await Student.removeFromCollection(userId, 'subscribedSkills').members([skillId]);
      const currentUser = await Student.findOne({ id: userId }).populate('subscribedSkills');
      res.ok({
        message: "Unsubscribed " + skill.name + ".",
        data: _.pick(currentUser, 'subscribedSkills')
      })
    } else {
      res.forbidden({
        message: "You haven't subscribed this skill yet.",
        devMessage: "You haven't subscribed this skill yet.",
        code: FORBIDDEN_ACTION
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