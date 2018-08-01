const nodemailer = require('nodemailer');
const nmMailGunTransporter = require('nodemailer-mailgun-transport');
const mailTemplate = require('./email-template');

const Promise = require("bluebird");

const defaultFromEmail = {
  name: process.env.MAILER_FROM_NAME,
  address: process.env.MAILER_FROM_ADDRESS
};

module.exports = mailerFactory();

function mailerFactory() {

  const mailConfig = {
    auth: {
      api_key: process.env.MAILGUN_APIKEY,
      domain: process.env.MAILGUN_DOMAIN
    },
    from: defaultFromEmail
  };

  function Mailer(templateDir) {
    // transporter
    const transporter = nmMailGunTransporter(mailConfig);
    this.transporter = nodemailer.createTransport(transporter);

    this.transporter.sendMail = Promise.promisify(this.transporter.sendMail, this.transporter);

    // template
    this.template = mailTemplate.getTemplate({
      templateDir
    });
  }

  Mailer.getMailer = function(templateDir) {
    return new Mailer(templateDir);
  };

  Mailer.prototype.close = function() {
    this.transporter.close();
  };

  Mailer.prototype.getContentData = function(contentData) {
    contentData.WEB_URL = process.env.WEB_URL;
    contentData.LOGO_URL = 'http://juniorviec.com/assets/images/logo2.png';

    return _.assign({}, contentData, { _data: contentData });
  };

  Mailer.prototype.getMailOptions = function(sendOptions, templateResults) {
    const mailOptions = {
      from: sendOptions.from || defaultFromEmail,
      sender: sendOptions.sender,
      to: sendOptions.to,

      subject: sendOptions.subject || templateResults.subject,
      text: sendOptions.text || templateResults.text,
      html: sendOptions.html || templateResults.html
    };

    if (sendOptions.cc) {
      mailOptions.cc = sendOptions.cc;
    }

    if (sendOptions.bcc) {
      mailOptions.bcc = sendOptions.bcc;
    }

    return mailOptions;
  }

  Mailer.prototype.send = function(sendOptions, contentData) {

    contentData = contentData || {};

    const self = this;

    return self.template
      .render(self.getContentData(contentData))
      .then(function(templateResults) {
        const mailOptions = self.getMailOptions(sendOptions, templateResults);
        return self.transporter.sendMail(mailOptions);
      });
  };

  // send to a User or a User Id
  Mailer.prototype.sendToUser = function(user, contentData) {
    if (!_.get(user, 'email')) return;
    const self = this;
    const sendOptions = {
      to: user.email
    };

    return self.send(sendOptions, contentData);
  };
  
  //Send to an email with lang
  Mailer.prototype.sendToEmail = function(email, contentData) {
    if (!email) return;
    const self = this;
    
    const sendOptions = {
      to: email
    };
  
    return self.send(sendOptions, contentData);
  };

  //Send to an email with cc other email
  Mailer.prototype.sendToEmailWithBccAdmin = function(email, contentData) {
    if (!email) return;
    const self = this;
    
    const sendOptions = {
      to: email,
      bcc: process.env.ADMIN_EMAIL
    };
  
    return self.send(sendOptions, contentData);
  };

  Mailer.prototype.sendToUsers = function(users, contentData) {
    const self = this;

    users = _.filter(users, user => !!user.email);

    const sends = users.map(user => self.sendToUser(user, contentData));

    return Promise.all(sends);
  };
  
  Mailer.prototype.sendToAdmins = function(contentData) {
    // TODO: Do it later
    
  };

  return Mailer;
}