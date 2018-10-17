module.exports = async function (req, res) {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }
  const userInfo = {
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
    await EmailService.sendToAdmins(admins, 'contact-admin', {
      userInfo
    });
    res.ok({
      message: "Your request successfully."
    })
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`
    });
  }
}