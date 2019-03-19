const {
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

const { SLUGIFY_COMPANY } = require('../../../constants/jobTypes');

module.exports = async function (req, res) {
  try {
    const companies = await Company.find({});

    const unslugifiedCompanies = _.filter(companies, com => !com.slug);

    _.each(unslugifiedCompanies, com => {
      const job = sails.config.queue.create(SLUGIFY_COMPANY, {
        company: _.pick(com, [ 'id', 'name'])
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