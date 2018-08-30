const Mailer = require('../../mailer');

module.exports = {

  sendToUser: async function (user, type, data) {
    const mailer = Mailer.getMailer(type);
    await mailer.sendToUser(user, data);
  },

  sendToUsers: async function (users, type, data) {
    const mailer = Mailer.getMailer(type);
    await mailer.sendToUser(users, data);
  },

  sendToEmail: async function (email, type, data) {
    const mailer = Mailer.getMailer(type);
    await mailer.sendToEmail(email, data);
  },

  sendToEmailWithBccAdmin: async function (email, type, data) {
    const mailer = Mailer.getMailer(type);
    await mailer.sendToEmailWithBccAdmin(email, data);
  },

  sendToAdmins: async function (email, type, data) {

  }

}