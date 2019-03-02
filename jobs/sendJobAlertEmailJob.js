const { SEND_JOB_ALERT_EMAIL } = require('../constants/jobTypes');
const constants = require('../constants');
const { ACTIVE } = constants.STATUS;
const moment = require("moment");

module.exports = async function (queue) {
  queue.process(SEND_JOB_ALERT_EMAIL, 5, sendJobAlertEmailFunc);

  async function sendJobAlertEmailFunc(job, done) {
    const { studentId } = _.get(job, 'data', {});

    try {
      const student = await Student.findOne({ id: studentId });
      if (!student || !student.emailVerified || student.status !== ACTIVE) {
        return done();
      }

      const subscribedSkills = await SkillSubscription.find({ student: studentId }).populate('skill');
      if (_.size(subscribedSkills) < 0) {
        return done();
      }

      const skills = _.map(subscribedSkills, 'skill.id');

      const searchReqBody = {
        skills: skills
      }
      const buildQuery = ElasticsearchService.buildQuery(searchReqBody);
      const transformResult = ElasticsearchService.transformResult();

      let query = { bool: { must: [] } };
      query.bool.must.push(buildQuery.activeJob());

      query.bool.must.push({
        range: {
          expiredAt: {
            gte: moment.now()
          }
        }
      });

      query.bool.must.push(buildQuery.multiChoices({
        type: "nested",
        request: "skills",
        field: "skills.id",
        path: "skills"
      }));

      query.bool.must = _.compact(query.bool.must);
      let result = await ElasticsearchService.search({
        type: "Job",
        body: {
          "size": 5,
          "from": 0,
          "query": query
        }
      }).then(transformResult.getHits);

      if (!_.size(result.list)) return done();

      const jobs = _.map(result.list, job => {
        job.salary = transformSalary(job.fromSalary, job.toSalary);
        job.company = _.pick(job.company, ['name', 'logoURL']);
        job.link = `${process.env.WEB_URL}/jobs/${job.id}`;
        return _.pick(job, ['id', 'title', 'company', 'link', 'skills', 'salary']);
      })

      const data = {
        subscribedSkills: _.chain(subscribedSkills).map('skill.name').join(', '),
        jobs,
        userInfo: student,
        moreJobsLink: `${process.env.WEB_URL}/browse-jobs?qs=${_.chain(subscribedSkills).map('skill.name').join('-')}`
      }

      EmailService.sendToUser(student, 'job-alert-email', data)
        .then(() => {
          done();
        })
        .catch(err => {
          done(err);
        })
    } catch (err) {
      return done(err);
    }
  }

  function transformSalary (fromSalary, toSalary) {
    if (!fromSalary) return `Up to ${toSalary}$`;
    if (fromSalary === toSalary) return `${toSalary}$`;
    return `${fromSalary}$ - ${toSalary}$`
  }
};
