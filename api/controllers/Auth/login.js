const passport = require('passport');

module.exports = async function (req, res) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return res.serverError(err);
    }

    if (!user) {
      return res.unauthorized(info);
    }

    if (!user.emailVerified) {
      return res.forbidden({
        message: "Email is not verified."
      });
    }

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
  })(req, res);
}