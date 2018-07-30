const passport = require('passport');

module.exports = async function (req, res) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      return res.badRequest(info);
    }

    // Remove sensitive data before login
    user.password = undefined;
    req.logIn(user, function (err) {
      if (err) { 
        res.serverError();
      }

      const token = JwtService.issue(user);
      user = JSON.parse(JSON.stringify(user));
      user.token = token;

      res.ok(user);
    });
  })(req, res);
}