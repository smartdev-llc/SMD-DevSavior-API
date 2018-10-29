module.exports = async function (req, res, proceed) {
  const user = _.get(req, 'user');

  if (!user || user.role !== 'student') {
    return res.unauthorized({
      message: "Permission denied."
    });
  }

  if (!user.emailVerified) {
    return res.forbidden({
      message: "Email is not verified."
    });
  }

  proceed();
}