
const constants = require('../../../constants');
const { VERIFICATION_TOKEN } = constants.TOKEN_TYPE;

module.exports = async function (req, res) {
  const token = _.get(req, 'query.token');
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

  const userId = _.get(decoded, 'id');
  const role = _.get(decoded, 'role');
  const type = _.get(decoded, 'token_type');

  if (_.isNil(userId) || !role || type !== VERIFICATION_TOKEN) {
    return res.forbidden({
      message: "Invalid token."
    });
  }

  let user, UserModel;
  try {
    if (role == 'company') {
      UserModel = Company;
    } else {
      UserModel = Student;
    }
    user = await UserModel.findOne({ id: userId });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  if (!UserModel) {
    return res.forbidden({
      message: "Something went wrong."
    });
  }

  if (!user) {
    return res.forbidden({
      message: "Something went wrong."
    });
  }

  if (user.emailVerified) {
    return res.ok({
      message: "Email is already verified."
    });
  }

  try {
    const verifiedUsers = await UserModel.update({ id: userId })
      .set({ emailVerified: true })
      .fetch();
    user = _.first(verifiedUsers);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  if (!_.get(user, 'emailVerified')) {
    return res.forbidden({
      message: "Cannot verify the email. Please try again."
    });
  }

  res.ok({
    message: "Email is verified successfully."
  });


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
}