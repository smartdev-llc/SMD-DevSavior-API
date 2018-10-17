const validator = require('validator');
const validatorUtils = require('../../../utils/validator');
const transformUtils = require('../../../utils/transformData');
const constants = require('../../../constants');
const { VERIFICATION_TOKEN } = constants.TOKEN_TYPE;
const { VERIFICATION_TOKEN_EXPIRATION: expiresIn } = constants.JWT_OPTIONS;

module.exports = async function (req, res) {
  const role = req.param('role') || 'student';

  if (role === 'company') {
    registerCompany(req, res);
  } else {
    registerStudent(req, res);
  }

  async function registerStudent(req, res) {
    const { email, password, firstName, lastName, profileImageURL } = req.body;
    const providers = ['local'];

    if (!email || !password || !firstName || !lastName) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }
  
    if (!validator.isEmail(email)) {
      return res.badRequest({
        message: "Invalid email."
      });
    }
  
    if (!validatorUtils.isValidPassword(password)) {
      return res.badRequest({
        message: "Password must be at least 8 characters."
      })
    }

    const studentReq = {
      email,
      password,
      firstName: _.escape(firstName),
      lastName: _.escape(lastName),
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
        const userInfo = await Student.create(studentReq).fetch();
        const decodedInfo = _.assign({}, _.pick(userInfo, ['id', 'email']), { role: 'student', token_type: VERIFICATION_TOKEN });
        const verificationToken = JwtService.issue(decodedInfo, { expiresIn });

        await EmailService.sendToUser(userInfo, 'verify-student-email', {
          verificationLink: `${process.env.WEB_URL}/verify-account?token=${verificationToken}`,
          userInfo
        });

        res.ok(userInfo);
      }
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  }

  async function registerCompany(req, res) {
    const { 
      email, 
      password, 
      name, 
      address,
      city,
      contactName,
      phoneNumber,
      website
    } = req.body;

    if (!email || !password || !name || !contactName || !phoneNumber || !address) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }
  
    if (!validator.isEmail(email)) {
      return res.badRequest({
        message: "Invalid email."
      });
    }
  
    if (!validatorUtils.isValidPassword(password)) {
      return res.badRequest({
        message: "Password must be at least 8 characters."
      })
    }

    if (!validatorUtils.isValidPhoneNumber(phoneNumber)) {
      return res.badRequest({
        message: "Invalid phone number."
      });
    }

    const companyReq = {
      email,
      password,
      name: _.escape(name),
      address,
      city: transformUtils.transformCity(city),
      contactName,
      phoneNumber,
      website,
      emailVerified: false
    }

    try {
      const companyWithCurrentEmail = await Company.findOne({ email });
      if (companyWithCurrentEmail) {
        return res.conflict({
          message: "This email already exists."
        });
      } else {
        const userInfo = await Company.create(companyReq).fetch();
        const decodedInfo = _.assign({}, _.pick(userInfo, ['id', 'email']), { role: 'company', token_type: VERIFICATION_TOKEN });
        const verificationToken = JwtService.issue(decodedInfo, { expiresIn });

        await EmailService.sendToUser(userInfo, 'verify-company-email', {
          verificationLink: `${process.env.WEB_URL}/verify-account?token=${verificationToken}`,
          userInfo
        });

        res.ok(userInfo);
      }
    } catch (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }
  }
}