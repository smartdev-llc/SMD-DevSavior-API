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
    } catch(err) {
      return res.serverError(err);
    }
  } else {
    try {
      userInfo = await Student.findOne({ email });
    } catch(err) {
      return res.serverError(err);
    }
  }

  if (!userInfo) {
    return res.badRequest({
      message: "This email does not match any account."
    });
  } else {
    const isVerified = _.get(userInfo, 'emailVerified', false)

    if (!!isVerified) {
      return res.badRequest({
        message: "This email is already verified"
      });
    }
    const decodedInfo = _.assign({}, _.pick(userInfo, ['id', 'email']), { role });
    const verificationToken = JwtService.issue(decodedInfo, { expiresIn: '1h' });

    try {
      await EmailService.sendToUser(userInfo, role === 'company' ? 'verify-company-email' : 'verify-student-email', {
        verificationLink: `${process.env.API_URL}/auth/verify?token=${verificationToken}`, // temporary
        userInfo
      });

      res.ok({
        message: "Sent email."
      })
    } catch(err) {
      return res.serverError({ message: "Cannot send email."});
    }
  }
}