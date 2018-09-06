const constants = require('../../../constants')
const { RESET_PASSWORD_TOKEN } = constants.TOKEN_TYPE;
const { RESET_PASSWORD_TOKEN_EXPIRATION: expiresIn } = constants.JWT_OPTIONS;

module.exports = async function (req, res) {
  const role = req.param('role') || 'student';
  const { email } = req.body;
  let userInfo;

  if (!email) {
    return res.badRequest({
      message: "You should provide your email to receive reset password email."
    });
  }

  if (role === 'company') {
    try {
      userInfo = await Company.findOne({ email });
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  } else {
    try {
      userInfo = await Student.findOne({ email });
      if (_.indexOf(userInfo.providers, 'local') == - 1) {
        return res.badRequest({
          message: "This email does not match any account."
        });
      }
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  }

  if (!userInfo) {
    return res.badRequest({
      message: "This email does not match any account."
    });
  } else {

    const decodedInfo = _.assign({}, _.pick(userInfo, ['id']), { role, token_type: RESET_PASSWORD_TOKEN });
    const resetPasswordToken = JwtService.issue(decodedInfo, { expiresIn });

    try {
      userInfo.displayName = role == 'company' ? userInfo.name : `${userInfo.firstName} ${userInfo.lastName}`;
      await EmailService.sendToUser(userInfo, 'reset-password-email', {
        resetPasswordLink: `${process.env.WEB_URL}/reset-password?token=${resetPasswordToken}`,
        userInfo
      });

      res.ok({
        message: "Sent email."
      });
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  }
}