const {
  MISSING_PARAMETERS,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const companyId = _.get(req, "params.companyId");
  const { size, page } = _.get(req, 'query');
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;

  if (!companyId) {
    return res.badRequest({
      message: "Missing parameter.",
      devMessage: "`companyId` is missing.",
      code: MISSING_PARAMETERS
    });
  }

  try {
    const job = await Job
    .find({ company: companyId })
    .populate('skills', { select: ['id', 'name'] })
    .populate('category')
    .populate('company')
    .limit(limit)
    .skip(skip);

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

};
