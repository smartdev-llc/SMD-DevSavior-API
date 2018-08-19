const passport = require('passport');

module.exports = async function (req, res) {
  const role = req.param('role') || 'student';
  const { email } = req.body;
  let userInfo;

  if (role === 'company') {
    if (!email) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }

    try {
      userInfo = await Company.findOne({ email });
      if (!userInfo) {
        return res.badRequest({
          message: "This email is not exists."
        });
      } else {
        const decodedInfo = _.assign({}, _.pick(userInfo, ['id', 'email']), { role: 'company' });
        const verificationToken = JwtService.issue(decodedInfo, { expiresIn: '1h' });

        EmailService.sendToUser(userInfo, 'verify-company-email', {
          // verificationLink: `${process.env.WEB_URL}/email/verify?token=${verificationToken}`,
          verificationLink: `${process.env.API_URL}/auth/verify?token=${verificationToken}`, // temporary
          userInfo
        });
      }
    } catch(err) {
      return res.serverError(err);
    }

  } else {
    if (!email) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }

    try {
      userInfo = await Student.findOne({ email });
      if (!userInfo) {
        return res.conflict({
          message: "This email is not exists."
        });
      } else {
        const decodedInfo = _.assign({}, _.pick(userInfo, ['id', 'email']), { role: 'student' });
        const verificationToken = JwtService.issue(decodedInfo, { expiresIn: '1h' });

        EmailService.sendToUser(userInfo, 'verify-student-email', {
          // verificationLink: `${process.env.WEB_URL}/email/verify?token=${verificationToken}`,
          verificationLink: `${process.env.API_URL}/auth/verify?token=${verificationToken}`, // temporary
          userInfo
        });

      }
    } catch(err) {
      return res.serverError(err);
    }
  }
  res.ok(userInfo);

}