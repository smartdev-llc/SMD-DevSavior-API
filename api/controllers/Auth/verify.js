const constants = require("../../../constants");
const { VERIFICATION_TOKEN } = constants.TOKEN_TYPE;

const { 
  MISSING_PARAMETERS,
  ALREADY_VERIFIED_EMAIL,
  INTERNAL_SERVER_ERROR,
  INVALID_TOKEN
} = require('../../../constants/error-code');

module.exports = async function(req, res) {
  const token = _.get(req, "query.token");
  if (!token) {
    return res.badRequest({
      message: "Please provide token to verify your account.",
      devMessage: '`token` is missing.',
      code: MISSING_PARAMETERS
    });
  }
  let decoded;
  try {
    decoded = JwtService.verify(token);
  } catch (err) {
    if (err) {
      return res.forbidden({
        message: "Invalid token.",
        devMessage: "Cannot verify this verification token.",
        code: INVALID_TOKEN
      });
    }
  }

  const userId = _.get(decoded, "id");
  const email = _.get(decoded, "email");
  const role = _.get(decoded, "role");
  const type = _.get(decoded, "token_type");

  if (_.isNil(userId) || _.isNil(email) || !role || type !== VERIFICATION_TOKEN) {
    return res.forbidden({
      message: "Invalid token.",
      devMessage: "Some data are missing from verification token.",
      code: INVALID_TOKEN
    });
  }

  let user, UserModel;
  try {
    if (role == "company") {
      UserModel = Company;
    } else if (role == "admin") {
      UserModel = Admin;
    } else {
      UserModel = Student;
    }
    user = await UserModel.findOne({
      id: userId,
      email
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!user) {
    return res.forbidden({
      message: "Invalid token.",
      devMessage: "Cannot get user data from verification token.",
      code: INVALID_TOKEN
    });
  }

  if (user.emailVerified) {
    return res.badRequest({
      message: "This email is already verified.",
      devMessage: "`email` is already verified",
      code: ALREADY_VERIFIED_EMAIL
    });
  }

  try {
    await UserModel.update({ id: userId }).set({ emailVerified: true });

    if (role === 'admin') {
      await EmailService.sendToUser(user, 'welcome-admin-email', {
        userInfo: user
      });
    }

    res.ok({
      message: "Email is verified successfully."
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  // Login automatically after verifying email

  // user.role = role;
  // // Remove sensitive data before login
  // user.password = undefined;
  // req.logIn(user, function (err) {
  //   if (err) {
  //     res.serverError({
  //      message: "Something went wrong."
  //      });
  //   }

  //   const token = JwtService.issue(user);
  //   user = JSON.parse(JSON.stringify(user));
  //   user.token = token;

  //   res.ok(user);
  // });
};
