const validator = require('validator');
const { 
  MISSING_PARAMETERS,
  INVALID_PARAMETERS,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message || !subject) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Some parameters are missing (`name` | `email` | `subject` | `message`).",
      code: MISSING_PARAMETERS
    });
  }

  if (!validator.isEmail(email)) {
    return res.badRequest({
      message: "Invalid email.",
      devMessage: "Invalid email.",
      code: INVALID_PARAMETERS
    });
  }

  const contactData = {
    name,
    email,
    message,
    subject
  };

  const admins = _.map(_.split(process.env.ADMIN_EMAILS, ','), email => {
    return {
      email
    }
  });

  try {
    await EmailService.sendToAdmins(admins, 'contact-email', contactData);
    return res.ok({
      message: "Your request successfully."
    });
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
}