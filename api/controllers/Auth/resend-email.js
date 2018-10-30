const constants = require('../../../constants')
const { VERIFICATION_TOKEN } = constants.TOKEN_TYPE;
const { VERIFICATION_TOKEN_EXPIRATION: expiresIn } = constants.JWT_OPTIONS;

module.exports = async function (req, res) {
  const role = req.param('role') || 'student';
  const { email } = req.body;
  let userInfo;

  if (!email) {
    return res.badRequest({
      message: "You should provide your email to receive verification email."
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
  } else if (role === 'admin') {
    try {
      userInfo = await Admin.findOne({ email });
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  } else {
    try {
      userInfo = await Student.findOne({ email });
      if (userInfo && _.indexOf(userInfo.providers, 'local') == - 1) {
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
    const isVerified = _.get(userInfo, 'emailVerified', false);

    if (isVerified) {
      return res.badRequest({
        message: "This email is already verified."
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
        message: "Sent email."
      })
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  }
}