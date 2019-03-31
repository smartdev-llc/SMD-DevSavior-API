const {
  INTERNAL_SERVER_ERROR
} = require("../../../constants/error-code");

const constants = require('../../../constants');
const { ACTIVE } = constants.STATUS;

module.exports = async function (req, res) {
  const { status } = req.query;
  try {
    const total = await Student.count({ status: status ? _.upperCase(status) : ACTIVE });
    return res.ok({
      total
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
};
