const {
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

const { SLUGIFY_JOB } = require('../../../constants/jobTypes');

module.exports = async function (req, res) {
  try {
    const jobs = await Job.find({});

    const unslugifiedJobs = _.filter(jobs, job => !job.slug);

    _.each(unslugifiedJobs, uJob => {
      const job = sails.config.queue.create(SLUGIFY_JOB, {
        job: _.pick(uJob, [ 'id', 'title'])
      })
        .priority('high')
        .attempts(5)
        .backoff(true)
        .save(err => {
          if (!err) console.log(job.id, ' is enqueued.');
        });
    })

    res.ok();

  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
}