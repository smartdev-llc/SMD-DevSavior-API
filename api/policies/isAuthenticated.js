const {
  UNVERIFIED_EMAIL,
  PERMISSION_DENIED
} = require('../../constants/error-code');

module.exports = async function (req, res, proceed) {
  const user = _.get(req, 'user');

  if (!user) {
    return res.unauthorized({
      message: "Permission denied.",
      devMessage: "You must login to do this action.",
      code: PERMISSION_DENIED
    });
  }

  if (!user.emailVerified) {
    return res.forbidden({
      message: "Email is not verified.",
      devMessage: "Email is not verified.",
      code: UNVERIFIED_EMAIL
    });
  }

  proceed();
}