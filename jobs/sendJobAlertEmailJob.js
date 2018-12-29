const { SEND_JOB_ALERT_EMAIL } = require('../constants/jobTypes');

module.exports = function (queue) {
  const sendJobAlertEmailFunc = (job, done) => {
    const { email } = _.get(job, 'data', {});
    const user = {
      displayName: "Dung Tran",
      email
    };

    const data = {
      skill: {
        id: 1,
        name: "Nodejs"
      },
      jobs: [{
        id: 1,
        title: "Job A"
      }, {
        id: 2,
        title: "Job B"
      }],
      jobLink: "https://juniorviec.com/jobs/1",
      userInfo: user
    }

    EmailService.sendToUser(user, 'job-alert-email', data)
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      })
    
  }

  queue.process(SEND_JOB_ALERT_EMAIL, 5, (job, done) => sendJobAlertEmailFunc(job, done));
};
