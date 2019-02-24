const bcrypt = require("bcrypt-nodejs");
const validator = require('validator');

const {
  WRONG_EMAIL_OR_PASSWORD,
  MISSING_PARAMETERS,
  INVALID_PARAMETERS,
  INTERNAL_SERVER_ERROR,
  UNVERIFIED_EMAIL,
  UNAPPROVED_ACCOUNT,
  UNAVAILABLE_ACCOUNT
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { ACCESS_TOKEN } = constants.TOKEN_TYPE;
const { PENDING, ACTIVE } = constants.STATUS;

module.exports = async function (req, res) {
  const role = req.param("role") || "student";
  const { email, password } = req.body;

  if (!email || !password) {
    return res.badRequest({
      message: "Missing email or password.",
      devMessage: "`email` and `password` are required.",
      code: MISSING_PARAMETERS
    });
  }

  if (!validator.isEmail(email)) {
    return res.badRequest({
      message: "Invalid email.",
      devMessage: "`email` is invalid.",
      code: INVALID_PARAMETERS
    });
  }

  let user;

  try {
    if (role === "company") {
      user = await Company.findOne({ email });
    } else if (role === "admin") {
      user = await Admin.findOne({ email });
    } else {
      user = await Student.findOne({ email });
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!user) {
    return res.unauthorized({
      message: "Wrong email or password.",
      devMessage: "`email` or `password` is wrong.",
      code: WRONG_EMAIL_OR_PASSWORD
    });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return res.unauthorized({
      message: "Wrong email or password.",
      devMessage: "`email` or `password` is wrong.",
      code: WRONG_EMAIL_OR_PASSWORD
    });
  }

  if (!user.emailVerified) {
    return res.forbidden({
      message: "Email is unverified.",
      devMessage: "Email is unverified",
      code: UNVERIFIED_EMAIL
    });
  }

  if (user.status === PENDING) {
    return res.forbidden({
      message: "Your account hasn't been approved yet. Please wait until Admin approves it",
      devMessage: "Your account hasn't been approved yet",
      code: UNAPPROVED_ACCOUNT
    });
  }

  if (user.status !== ACTIVE) {
    return res.forbidden({
      message: "Your account is not available.",
      devMessage: "Your account is not available",
      code: UNAVAILABLE_ACCOUNT
    });
  }

  user.role = role;

  const decodedInfo = _.assign({}, _.pick(user, ['id', 'email', 'role', 'password']), { token_type: ACCESS_TOKEN });
  const token = JwtService.issue(decodedInfo);
  user.token = token;

  res.ok(user);
}