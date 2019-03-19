const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { ACTIVE } = constants.STATUS;

module.exports = async function (req, res) {
  const userRole = _.get(req, 'user.role');
  const { slug } = req.params;
  if (!slug || slug !== 'undefined') {
    return res.notFound({
      message: 'Company is not found.',
      devMessage: 'Company is not found.',
      code: NOT_FOUND
    });
  }

  try {
    const company = userRole === 'admin' ? await Company.findOne({ slug }) : await Company.findOne({ slug, emailVerified: true, status: ACTIVE });
    if (!company) {
      return res.notFound({
        message: 'Company is not found.',
        devMessage: 'Company is not found.',
        code: NOT_FOUND
      });
    }
    res.ok(company);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
}