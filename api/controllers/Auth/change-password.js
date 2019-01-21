
const bcrypt = require('bcrypt-nodejs');

const validatorUtils = require('../../../utils/validator');

const { 
  MISSING_PARAMETERS,
  INVALID_PARAMETERS,
  INCORRECT_PASSWORD,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const { password, newPassword } = req.body;
  const { id: userId, role } = req.user; 
  if (!password) {
    return res.badRequest({
      message: "Please provide old password to do this action.",
      devMessage: "`password` is missing.",
      code: MISSING_PARAMETERS
    });
  }

  let user, UserModel;
  if (role === 'company') {
    UserModel = Company;
  } else if (role === 'admin') {
    UserModel = Admin;
  } else {
    UserModel = Student;
  }

  try {
    user = await UserModel.findOne({ id: userId });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return res.unauthorized({
      message: "Old password is incorrect.",
      devMessage: "`Password` is incorrect.",
      code: INCORRECT_PASSWORD
    });
  }

  if (!newPassword) {
    return res.badRequest({
      message: "New password cannot be empty.",
      devMessage: "`password` is empty.",
      code: MISSING_PARAMETERS
    });
  }

  if (password === newPassword) {
    return res.badRequest({
      message: "New password must be different from old password.",
      devMessage: "`password` and `newPasword` are same.",
      code: INVALID_PARAMETERS
    })
  }

  if (!validatorUtils.isValidPassword(newPassword)) {
    return res.badRequest({
      message: "Invalid password.",
      devMessage: "Invalid `password`. It must be at least 8 characters.",
      code: INVALID_PARAMETERS
    })
  }

  let hashPassword;
  try {
    const salt = bcrypt.genSaltSync(10);
    hashPassword = bcrypt.hashSync(newPassword, salt);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  try {
    await UserModel.updateOne({ id: userId })
      .set({ password: hashPassword });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  const accessToken = req.accessToken;
  if (accessToken) {
    try {
      await addTokenToBlackList(accessToken);
    } catch (err) {
      // Ignore
    }
  }

  res.ok({
    message: "Your password has been changed. Please login again to continue."
  });

  async function addTokenToBlackList() {
    let decoded;
    try {
      decoded = await JwtService.verify(accessToken);
    } catch (err) {
      if (err) {
        return;
      }
    }

    const jwtid = _.get(decoded, 'jwtid');
    const expirationTime = _.get(decoded, 'exp');
    if (!_.isNil(jwtid) && _.isNumber(expirationTime)) {
      const now = Date.now();
      if (expirationTime - now / 1000 > 0) {
        const exp = Math.round(expirationTime - now / 1000);
        JwtService.addToBlackList(jwtid, exp);
      }
    }
  }
}