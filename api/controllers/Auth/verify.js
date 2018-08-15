module.exports = async function (req, res) {
  const token = _.get(req, 'query.token');
  if (!token) {
    return res.badRequest({
      message: "Please provide token to verify your account."
    });
  }
  let decoded;
  try {
    decoded = JwtService.verify(token, { ignoreExpiration: true });
  } catch (err) {
    if (err) {
      return res.forbidden({
        message: "Invalid token."
      });
    }
  }

  const userId = _.get(decoded, 'id');
  const role = _.get(decoded, 'role');

  if (_.isNil(userId) || !role) {
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
    return res.serverError(err);
  }

  if (!UserModel) {
    return res.serverError('Something went wrong.')
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
    return res.serverError(err);
  }

  if (!_.get(user, 'emailVerified')) {
    return res.forbidden({
      message: "Cannot verify the email. Please try again."
    });
  }

  user.role = role;
  // Remove sensitive data before login
  user.password = undefined;
  req.logIn(user, function (err) {
    if (err) { 
      res.serverError(err);
    }

    const token = JwtService.issue(user);
    user = JSON.parse(JSON.stringify(user));
    user.token = token;

    res.ok(user);
  });
}