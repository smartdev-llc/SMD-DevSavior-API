const validator = require('validator');
const constants = require('../../../constants');
const { VERIFICATION_TOKEN } = constants.TOKEN_TYPE;
const { VERIFICATION_TOKEN_EXPIRATION: expiresIn } = constants.JWT_OPTIONS;

module.exports = async function (req, res) {
  const role = req.param('role') || 'student';
  const { email, password, firstName, lastName, name, profileImageURL } = req.body;
  const gender = transformGender(req.body.gender);
  const providers = ['local'];
  let userInfo;

  if (!email || !password) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!validator.isEmail(email)) {
    return res.badRequest({
      message: "Invalid email."
    });
  }

  if (!isValidPassword(password)) {
    return res.badRequest({
      message: "Password must be at least 8 characters."
    })
  }

  if (role === 'company') {
    if (!name) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }

    const companyReq = {
      email,
      password,
      name: _.escape(name),
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

        const decodedInfo = _.assign({}, _.pick(userInfo, ['id']), { role: 'company', token_type: VERIFICATION_TOKEN });
        const verificationToken = JwtService.issue(decodedInfo, { expiresIn });

        EmailService.sendToUser(userInfo, 'verify-company-email', {
          // verificationLink: `${process.env.WEB_URL}/email/verify?token=${verificationToken}`,
          verificationLink: `${process.env.API_URL}/auth/verify?token=${verificationToken}`, // temporary
          userInfo
        });
      }
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }

  } else {
    if (!firstName || !lastName) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }

    const studentReq = {
      email,
      password,
      firstName: _.escape(firstName),
      lastName: _.escape(lastName),
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
        const decodedInfo = _.assign({}, _.pick(userInfo, ['id']), { role: 'student', token_type: VERIFICATION_TOKEN });
        const verificationToken = JwtService.issue(decodedInfo, { expiresIn });

        EmailService.sendToUser(userInfo, 'verify-student-email', {
          // verificationLink: `${process.env.WEB_URL}/email/verify?token=${verificationToken}`,
          verificationLink: `${process.env.API_URL}/auth/verify?token=${verificationToken}`, // temporary
          userInfo
        });
      }
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  }

  res.ok(userInfo);

  function transformGender(reqGender) {
    reqGender = _.toUpper(reqGender);
    switch (reqGender) {
      case 'male': return 'MALE';
      case 'female': return 'FEMALE';
      case 'other': return 'OTHER';
      default: return 'OTHER';
    }
  }

  function isValidPassword(password) {
    return validator.isLength(password, {
      min: 8,
      max: undefined
    });
  }
}