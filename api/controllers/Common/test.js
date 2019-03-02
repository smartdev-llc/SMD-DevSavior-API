const { SEND_JOB_ALERT_EMAIL } = require('../../../constants/jobTypes');

module.exports = async function (req, res) {
  const job = sails.config.queue.create(SEND_JOB_ALERT_EMAIL, {
    title: 'send job alert email',
    email: 'ttdung001@gmail.com'
  })
    .priority('high')
    .attempts(5)
    .backoff(true)
    .save(err => {
      if (!err) console.log(job.id, ' is enqueued.');
    });

    res.ok("Sent");
}