const moment = require('moment');
const { SEND_JOB_ALERT_EMAIL } = require('../../constants/jobTypes');

module.exports = {

  sendJobAlerts: async function () {
    try {
      const subStudents = await sails.sendNativeQuery('SELECT student from skillsubscription group by student');

      if (!_.size(subStudents.rows)) return;
      const stdIds = _.map(subStudents.rows, 'student');
      _.each(stdIds, stdId => {
        const job = sails.config.queue.create(SEND_JOB_ALERT_EMAIL, {
          studentId: stdId
        })
          .priority('high')
          .attempts(5)
          .backoff(true)
          .save(err => {
            if (!err) console.log(job.id, ' is enqueued.');
          });
      })
    } catch (err) {
      console.log(err);
    }
  },

  removeUnusedUsers: async function () {
    try {
      const tenDaysAgo = moment().subtract(10, 'days').valueOf();
      const unusedConditions = {
        emailVerified: false,
        createdAt: {
          '<=': tenDaysAgo
        }
      }
      await Student.destroy(unusedConditions);
      await Company.destroy(unusedConditions);
    } catch (err) {
      console.log(err);
    }
  }

}