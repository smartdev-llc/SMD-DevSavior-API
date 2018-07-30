const passport = require('passport');

module.exports = async function (req, res) {
  const provider = req.params.provider;
  if (!isValidSocialProvider(provider)) {
    return res.badRequest();
  }

  return passport.authenticate(provider, function(err, user) {
    if (err) {
      return err.status == 400 ? res.badRequest() : res.serverError(err);
    }

    req.logIn(user, function(err) {
      if (err) {
        return res.serverError(err);
      }

      var token = JwtService.issue(user);
      user = JSON.parse(JSON.stringify(user));
      user.token = token;

      res.ok(user);
    });
  })(req, res);
}

function isValidSocialProvider(provider) {
  const validProviders = ["facebook", "google"];
  return _.indexOf(validProviders, provider) !== -1;
}