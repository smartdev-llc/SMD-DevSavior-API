const { COMPANY_PUBLIC_FIELDS } = require('../../../constants');

module.exports = async function (req, res) {
  try {
    const companies = await Company.find({}).select(COMPANY_PUBLIC_FIELDS);
    res.ok(companies);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    })
  }
}