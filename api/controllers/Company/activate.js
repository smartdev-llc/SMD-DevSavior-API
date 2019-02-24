const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CANNOT_EXECUTE_ACTION,
  MISSING_PARAMETERS
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { INACTIVE, ACTIVE } = constants.STATUS;

const sendEmailToCompany = (company) => {
  const contentData = {
    company,
    loginLink: `${process.env.EMPLOYER_URL}/login`
  };
  EmailService.sendToUser({ email: _.get(company, 'email') }, "company-is-activated-email", contentData);
};

module.exports = async function (req, res) {
  const { id } = _.get(req, "params");

  if (!id || id === "undefined") {
    return res.badRequest({
      message: "Company id is missing.",
      devMessage: "Company id is missing.",
      code: MISSING_PARAMETERS
    });
  }

  let company;

  try {
    company = await Company.findOne({ id });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  if (!company) {
    return res.notFound({
      message: 'Company is not found.',
      devMessage: 'Company is not found.',
      code: NOT_FOUND
    });
  }

  if (company.status !== INACTIVE) {
    return res.badRequest({
      message: 'Cannot execute this action. Company is not inactive.',
      devMessage: 'Company status is not pending and not inactive.',
      code: CANNOT_EXECUTE_ACTION
    });
  }

  try {

    let updatedBody = {
      status: ACTIVE
    };

    const updatedCompany = await Company.updateOne({ id })
      .set(updatedBody);

    sendEmailToCompany(updatedCompany);

    return res.ok(updatedCompany);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}