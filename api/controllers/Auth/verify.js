const constants = require("../../../constants");
const { VERIFICATION_TOKEN } = constants.TOKEN_TYPE;

module.exports = async function(req, res) {
  const token = _.get(req, "query.token");
  if (!token) {
    return res.badRequest({
      message: "Please provide token to verify your account."
    });
  }
  let decoded;
  try {
    decoded = JwtService.verify(token);
  } catch (err) {
    if (err) {
      return res.forbidden({
        message: "Invalid token."
      });
    }
  }

  const userId = _.get(decoded, "id");
  const email = _.get(decoded, "email");
  const role = _.get(decoded, "role");
  const type = _.get(decoded, "token_type");

  if (
    _.isNil(userId) ||
    _.isNil(email) ||
    !role ||
    type !== VERIFICATION_TOKEN
  ) {
    return res.forbidden({
      message: "Invalid token."
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
      message: "Something went wrong."
    });
  }

  if (!user) {
    return res.forbidden({
      message: "Invalid token."
    });
  }

  if (user.emailVerified) {
    return res.ok({
      message: "Email is already verified."
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
      message: "Something went wrong."
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
