
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const constants = require('../../../constants');
const { RESET_PASSWORD_TOKEN } = constants.TOKEN_TYPE;

module.exports = async function (req, res) {
  const token = _.get(req, 'query.token');
  const { password } = req.body;
  if (!token) {
    return res.badRequest({
      message: "Please provide token to reset your password."
    });
  }

  if (!password) {
    return res.badRequest({
      message: "New password cannot be empty."
    });
  }

  if (!isValidPassword(password)) {
    return res.badRequest({
      message: "Password must be at least 8 characters."
    })
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

  if (_.isNil(userId) || !role || type !== RESET_PASSWORD_TOKEN) {
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

  let hashPassword;
  try {
    const salt = bcrypt.genSaltSync(10);
    hashPassword = bcrypt.hashSync(password, salt);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }


  try {
    await UserModel.update({ id: userId })
      .set({ password: hashPassword });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  res.ok({
    message: "Reset password successfully."
  });

  function isValidPassword(password) {
    return validator.isLength(password, {
      min: 8,
      max: undefined
    });
  }
}