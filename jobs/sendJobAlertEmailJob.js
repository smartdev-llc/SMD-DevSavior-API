const { SEND_JOB_ALERT_EMAIL } = require('../constants/jobTypes');

module.exports = function (queue) {
  const sendJobAlertEmailFunc = (job, done) => {
    const { email } = _.get(job, 'data', {});
    const user = {
      displayName: "Dung Tran",
      email
    };

    const data = {
      subscribedSkills: 'NodeJS, HTML, CSS',
      jobs: [{
        id: 1,
        title: "Job A",
        link: 'https://juniorviec.com/jobs/9',
        company: {
          name: "Smartdev"
        },
        skills: [
          { name: "Nodejs"}, { name: "HTML"}, { name: "CSS"}
        ],
        salary: 'Up to 2000$'
      }, {
        id: 2,
        title: "We need Junior Dev",
        link: 'https://juniorviec.com/jobs/2',
        company: {
          name: "Neolab"
        },
        skills: [
          { name: "Java"}, { name: ".NET"}
        ],
        salary: "400$-1000$"
      }],
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
