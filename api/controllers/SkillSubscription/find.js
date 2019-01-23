const {
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const userId = _.get(req, 'user.id');
  try {
    const subscriptions = await SkillSubscription.find({ student: userId }).populate('skill');
    const result = _.map(subscriptions, subscription => _.pick(subscription, [ 'id', 'createdAt', 'skill']));
    res.ok(result);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
}