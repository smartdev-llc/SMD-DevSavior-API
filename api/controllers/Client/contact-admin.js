module.exports = async function (req, res) {
  const { name, email, message } = req.body;
  const userInfo = {
    name,
    email,
    message
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