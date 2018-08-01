const passport = require('passport');

module.exports = async function (req, res) {
  const role = req.param('role') || 'student';
  const { email, password, firstName, lastName, name, profileImageURL } = req.body;
  let gender = req.body.gender || "UNKNOWN";
  const providers = ['local'];

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
      profileImageURL
    }

    try {
      const companyWithCurrentEmail = await Company.findOne({ email });
      if (companyWithCurrentEmail) {
        return res.conflict({
          message: "This email already exists."
        });
      } else {
        let userInfo = await Company.create(companyReq).fetch();
        EmailService.sendToUser(userInfo, 'verify-company-email', {
          verificationLink: process.env.WEB_URL, // TODO: create verification link later
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
        let userInfo = await Student.create(studentReq).fetch();
        EmailService.sendToUser(userInfo, 'verify-student-email', {
          verificationLink: process.env.WEB_URL, // TODO: create verification link later
          userInfo
        });
      }
    } catch(err) {
      return res.serverError(err);
    }
  }

  passport.authenticate('local', function (err, user, info) {
    // Remove sensitive data before login
    user.password = undefined;
    req.logIn(user, function (err) {
      if (err) {
        res.serverError(err);
      } else {
        var token = JwtService.issue(user);
        user = JSON.parse(JSON.stringify(user));
        user.token = token;
        res.ok(user);
      }
    });
  })(req, res);
}