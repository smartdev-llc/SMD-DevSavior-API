const { COMPANY_PUBLIC_FIELDS } = require('../../../constants');

module.exports = async function (req, res) {
  const { id } = req.params;
  try {
    const company = await Company.findOne({ id }).select(COMPANY_PUBLIC_FIELDS);
    if (!company) {
      return res.notFound({
        message: 'Company is not found.'
      });
    }
    res.ok(company);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    })
  }
}