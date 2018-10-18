const validator = require('validator');
module.exports = async function (req, res) {
  const { name, email, subject, message } = req.body;

  if (!checkParams(name, email, subject, message)) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!validator.isEmail(email)) {
    return res.badRequest({
      message: "Invalid email."
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
    await EmailService.sendToAdmins(admins, 'contact-admin', contactData);
    return res.ok({
      message: "Your request successfully."
    });
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`
    });
  }
}

const checkParams = (name, email, subject, message) => {
  if (!name || !email || !subject || !message) return false;
  if (!_.isString(name) || !_.isString(email) || !_.isString(subject) || !_.isString(message)) return false;
  return _.trim(name).length && _.trim(email).length && _.trim(subject).length && _.trim(message).length;
}