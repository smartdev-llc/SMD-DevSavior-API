const validator = require('validator');

const { 
  MISSING_PARAMETERS,
  INVALID_PARAMETERS,
  WRONG_EMAIL,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { RESET_PASSWORD_TOKEN } = constants.TOKEN_TYPE;
const { RESET_PASSWORD_TOKEN_EXPIRATION: expiresIn } = constants.JWT_OPTIONS;

module.exports = async function (req, res) {
  const role = req.param('role') || 'student';
  const { email } = req.body;
  let userInfo;

  if (!email) {
    return res.badRequest({
      message: "You should provide your email to receive reset password link.",
      devMessage: "`email` is required.",
      code: MISSING_PARAMETERS
    });
  }

  if (!validator.isEmail(email)) {
    return res.badRequest({
      message: "Invalid email.",
      devMessage: "`email` is invalid.",
      code: INVALID_PARAMETERS
    })
  }

  let UserModel;
  if (role === 'company') {
    UserModel = Company;
  } else {
    UserModel = Student;
  }

  try {
    userInfo = await UserModel.findOne({ email });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!userInfo) {
    return res.badRequest({
      message: "This email does not match any account.",
      devMessage: '`email` is inexistent in `student` table',
      code: WRONG_EMAIL
    });
  }
  
  if (role === 'student' && _.indexOf(userInfo.providers, 'local') == - 1) {
    return res.badRequest({
      message: "This email does not match any account.",
      devMessage: '`email` is inexistent in `student` table',
      code: WRONG_EMAIL
    });
  }

  const decodedInfo = _.assign({}, _.pick(userInfo, ['id', 'email']), { role, token_type: RESET_PASSWORD_TOKEN });
  const resetPasswordToken = JwtService.issue(decodedInfo, { expiresIn });

  try {
    userInfo.displayName = role === 'company' ? userInfo.name : userInfo.displayName;
    resetPasswordLink = role === 'company' ? `${process.env.EMPLOYER_URL}/reset-password?token=${resetPasswordToken}` : `${process.env.WEB_URL}/reset-password?token=${resetPasswordToken}`;
    await EmailService.sendToUser(userInfo, 'reset-password-email', {
      resetPasswordLink,
      userInfo
    });

    res.ok({
      message: "A reset password link has been sent to your email."
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}