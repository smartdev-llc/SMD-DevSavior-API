const {
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  try {
    const subscriptions = await SkillSubscription.find({ student: userId }).populate('skill');
    res.ok(_.pick(subscriptions, [ 'id', 'createdAt', 'skill']));
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
}