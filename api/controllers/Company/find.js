const {
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');
const { COMPANY_PUBLIC_FIELDS } = require('../../../constants');

const constants = require('../../../constants');
const { ACTIVE } = constants.STATUS;

module.exports = async function (req, res) {
  const userRole = _.get(req, 'user.role');
  try {
    const companies = userRole === 'admin' ? await Company.find({}) : await Company.find({ emailVerified: true, status: ACTIVE }).select(COMPANY_PUBLIC_FIELDS);
    res.ok(companies);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
}