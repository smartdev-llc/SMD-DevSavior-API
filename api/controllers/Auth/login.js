const passport = require('passport');
const constants = require('../../../constants');
const { ACCESS_TOKEN } = constants.TOKEN_TYPE;
let debuglog = require('debug')('jv:login')

module.exports = async function (req, res) {
  debuglog('req: ', req.body);
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return res.serverError({
        message: "Something went wrong."
      });
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
    req.logIn(user, async function (err) {
      if (err) {
        res.serverError({
          message: "Something went wrong."
        });
      }

      const decodedInfo = _.assign({}, _.pick(user, ['id', 'email', 'role']), { token_type: ACCESS_TOKEN })
      const token = await JwtService.issue(decodedInfo);
      user = JSON.parse(JSON.stringify(user));
      user.token = token;

      res.ok(user);
    });
  })(req, res);
}