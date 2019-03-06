const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  MISSING_PARAMETERS,
  INVALID_PARAMETERS
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const { stars, comment } = _.get(req, "body");
  const { companyId } = _.get(req, "params");
  const studentId = _.get(req, "user.id");

  if (!companyId || companyId === "undefined" || !comment) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Some paramters are missing (`companyId` | `comment`).",
      code: MISSING_PARAMETERS
    });
  }

  let company;

  try {
    company = await Company.findOne({ id: companyId });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!company) {
    return res.notFound({
      message: "Company is not found.",
      devMessage: "Company is not found.",
      code: NOT_FOUND
    });
  }

  if (!_.inRange(stars, 1, 6)) {
    return res.badRequest({
      message: "Stars is not in [1, 5].",
      devMessage: "Stars is not in [1, 5].",
      code: INVALID_PARAMETERS
    });
  }

  let companyReview;
  try {
    companyReview = await CompanyReview.findOne({
      company: companyId,
      student: studentId,
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  try {
    if (!companyReview) {
      companyReview = await CompanyReview.create({
        company: companyId,
        student: studentId,
        stars,
        comment
      }).fetch();

      res.ok(companyReview);
    } else {
      companyReview = await CompanyReview.update({
        company: companyId,
        student: studentId,
      }).set({
        stars,
        comment
      }).fetch();

      res.ok(companyReview);
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

};
