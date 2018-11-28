const {
  INVALID_PARAMETERS,
  MISSING_PARAMETERS,
  ALREADY_SUBSCRIBE,
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

  const reqBody = { student: userId, skill: skillId };

  try {
    const existesSubscription = await SkillSubscription.findOne(reqBody);

    if (existesSubscription) {
      return res.conflict({
        message: "You already subscribed this skill.",
        devMessage: "You already subscribed this skill.",
        code: ALREADY_SUBSCRIBE
      })
    } else {
      await SkillSubscription.create(reqBody);
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