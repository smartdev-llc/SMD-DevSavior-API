const { COMPANY_PUBLIC_FIELDS } = require('../../../constants');

module.exports = async function (req, res) {
  const { id } = req.params;
  try {
    const company = await Company.findOne({ id }).select(COMPANY_PUBLIC_FIELDS);
    res.ok(company);
  } catch (err) {
    console.log(err);
    return res.serverError({
      message: "Something went wrong."
    })
  }
}