const passport = require('passport');

module.exports = async function (req, res) {
  const role = req.param('role') || 'student';
  const { email, password, firstName, lastName, name, profileImageURL } = req.body;
  let gender = req.body.gender || "UNKNOWN";
  const providers = ['local'];
  let userInfo;

  if (role === 'company') {
    if (!email || !password || !name) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }

    const companyReq = {
      email,
      password,
      name,
      profileImageURL,
      emailVerified: false
    }

    try {
      const companyWithCurrentEmail = await Company.findOne({ email });
      if (companyWithCurrentEmail) {
        return res.conflict({
          message: "This email already exists."
        });
      } else {
        userInfo = await Company.create(companyReq).fetch();

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
    if (!email || !password || !firstName || !lastName) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }

    const studentReq = {
      email,
      password,
      firstName,
      lastName,
      gender,
      profileImageURL,
      providers
    }

    try {
      const studentWithCurrentEmail = await Student.findOne({ email });
      if (studentWithCurrentEmail) {
        return res.conflict({
          message: "This email already exists."
        });
      } else {
        userInfo = await Student.create(studentReq).fetch();
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