const { slugify } = require('./../utils/transformData');
const { SLUGIFY_JOB } = require('../constants/jobTypes');

module.exports = async function (queue) {
  queue.process(SLUGIFY_JOB, 5, slugifyJobFunc);

  async function slugifyJobFunc(task, done) {
    const { job } = _.get(task, 'data', {});
    const slug = slugify(job.title);

    try {
      await Job.updateOne({ id: job.id })
        .set({ slug });

      await ElasticsearchService.update({
        type: 'Job',
        id: job.id,
        body: {
          doc: { slug }
        }
      });
      done();
    } catch (err) {
      return done(err);
    }
  }
};
