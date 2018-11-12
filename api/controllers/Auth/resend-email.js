
const validator = require('validator');

const constants = require('../../../constants')
const { VERIFICATION_TOKEN } = constants.TOKEN_TYPE;
const { VERIFICATION_TOKEN_EXPIRATION: expiresIn } = constants.JWT_OPTIONS;

const { 
  MISSING_PARAMETERS,
  INVALID_PARAMETERS,
  WRONG_EMAIL,
  ALREADY_VERIFIED_EMAIL,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const role = req.param('role') || 'student';
  const { email } = req.body;
  let userInfo;

  if (!email) {
    return res.badRequest({
      message: "You should provide your email to receive verification email.",
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
  } else if (role === 'admin') {
    UserModel = Admin;
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

  const isVerified = _.get(userInfo, 'emailVerified', false);
  
  if (isVerified) {
    return res.badRequest({
      message: "This email is already verified.",
      devMessage: "`email` is already verified",
      code: ALREADY_VERIFIED_EMAIL
    });
  }
  const decodedInfo = _.assign({}, _.pick(userInfo, ['id', 'email']), { role, token_type: VERIFICATION_TOKEN });
  const verificationToken = JwtService.issue(decodedInfo, { expiresIn });

  try {
    let template = 'verify-student-email';
    let verificationLink = `${process.env.WEB_URL}/verify-account?token=${verificationToken}`;
    let receiverInfo = userInfo;

    if (role === 'company') {
      template = 'verify-company-email';
      verificationLink = `${process.env.WEB_URL}/employer/verify-account?token=${verificationToken}`;
    }

    if (role === 'admin') {
      template = 'verify-admin-email';
      verificationLink = `${process.env.WEB_URL}/admin/verify-account?token=${verificationToken}`;
      receiverInfo = _.map(_.split(process.env.ADMIN_EMAILS, ','), email => {
        return {
          email
        }
      });
    }

    if (role === 'admin') {
      await EmailService.sendToAdmins(receiverInfo, template, {
        verificationLink,
        userInfo
      });
    } else {
      await EmailService.sendToUser(receiverInfo, template, {
        verificationLink,
        userInfo
      });
    }

    res.ok({
      message: "A verification link has been sent to your email."
    })
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}