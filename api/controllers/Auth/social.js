const passport = require('passport');

module.exports = async function (req, res) {
  const provider = req.params.provider;
  if (!isValidSocialProvider(provider)) {
    return res.badRequest();
  }

  const socialScope = getSocialScope(provider);

  passport.authenticate(provider, { scope: socialScope }, function(err) {
    if (err) {
      return res.serverError(err);
    }
    res.ok();
  })(req, res);

}

function isValidSocialProvider(provider) {
  const validProviders = ["facebook", "google"];
  return _.indexOf(validProviders, provider) !== -1;
}

function getSocialScope(provider) {
  switch(provider) {
    case 'facebook': return [ 
      'email', 
      'user_gender'
    ];
    case 'google': return [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];
    default: return [];
  }
}