const { slugify } = require('./../utils/transformData');
const { SLUGIFY_COMPANY } = require('../constants/jobTypes');

module.exports = async function (queue) {
  queue.process(SLUGIFY_COMPANY, 5, slugifyCompanyFunc);

  async function slugifyCompanyFunc(task, done) {
    const { company } = _.get(task, 'data', {});
    const slug = slugify(company.name);

    try {
      await Company.updateOne({ id: company.id })
        .set({ slug });
      ElasticsearchService.updateByQuery({
        type: 'Job',
        body: {
          query: {
            nested: {
              path: "company",
              query: {
                term: {
                  "company.id": company.id
                }
              }
            }
          },
          script: {
            source:  `ctx._source.company.slug = '${slug}';`
          }
        }
      });
      done();
    } catch (err) {
      return done(err);
    }
  }
};
