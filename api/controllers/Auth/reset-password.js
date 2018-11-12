
const bcrypt = require('bcrypt-nodejs');

const validatorUtils = require('../../../utils/validator');

const constants = require('../../../constants');
const { RESET_PASSWORD_TOKEN } = constants.TOKEN_TYPE;

const { 
  MISSING_PARAMETERS,
  INVALID_PARAMETERS,
  INVALID_TOKEN,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const token = _.get(req, 'query.token');
  const { password } = req.body;
  if (!token) {
    return res.badRequest({
      message: "Please provide token to reset your password.",
      devMessage: "`token` is missing.",
      code: MISSING_PARAMETERSs
    });
  }

  if (!password) {
    return res.badRequest({
      message: "New password cannot be empty.",
      devMessage: "`password` is empty.",
      code: MISSING_PARAMETERS
    });
  }

  if (!validatorUtils.isValidPassword(password)) {
    return res.badRequest({
      message: "Invalid password.",
      devMessage: "Invalid `password`. It must be at least 8 characters.",
      code: INVALID_PARAMETERS
    })
  }

  let decoded;
  try {
    decoded = JwtService.verify(token);
  } catch (err) {
    if (err) {
      return res.forbidden({
        message: "Invalid token.",
        devMessage: "Cannot verify reset password token.",
        code: INVALID_TOKEN
      });
    }
  }

  const userId = _.get(decoded, 'id');
  const email = _.get(decoded, 'email');
  const role = _.get(decoded, 'role');
  const type = _.get(decoded, 'token_type');

  if (_.isNil(userId) || _.isNil(email) || !role || type !== RESET_PASSWORD_TOKEN) {
    return res.forbidden({
      message: "Invalid token.",
      devMessage: "Some data are missing from reset password token.",
      code: INVALID_TOKEN
    });
  }

  let user, UserModel;
  if (role == 'company') {
    UserModel = Company;
  } else {
    UserModel = Student;
  }

  try {
    user = await UserModel.findOne({ id: userId, email });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!user) {
    return res.forbidden({
      message: "Invalid token.",
      devMessage: "Cannot get user data from reset password token.",
      code: INVALID_TOKEN
    });
  }

  let hashPassword;
  try {
    const salt = bcrypt.genSaltSync(10);
    hashPassword = bcrypt.hashSync(password, salt);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  try {
    await UserModel.update({ id: userId })
      .set({ password: hashPassword });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  res.ok({
    message: "Your password has been reset."
  });
}