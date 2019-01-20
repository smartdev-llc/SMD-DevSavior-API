const { SEND_JOB_ALERT_EMAIL } = require('../constants/jobTypes');
const constants = require('../constants');
const { ACTIVE } = constants.STATUS;
const moment = require("moment");

module.exports = async function (queue) {
  queue.process(SEND_JOB_ALERT_EMAIL, 5, sendJobAlertEmailFunc);

  async function sendJobAlertEmailFunc(job, done) {
    const { studentId } = _.get(job, 'data', {});

    console.log(studentId)

    try {
      const student = await Student.findOne({ id: studentId });
      if (!student || !student.emailVerified || student.status !== ACTIVE) {
        return done();
      }

      const subscribedSkills = await SkillSubscription.find({ student: studentId }).populate('skill');
      if (_.size(subscribedSkills) < 0) {
        return done();
      }

      console.log('subscribedSkills: ', subscribedSkills);

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
            gt: moment.now()
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

      console.log('query: ', JSON.stringify(query));
      console.log('result.list: ', result.list);

      if (!_.size(result.list)) return done();

      const jobs = _.map(result.list, job => {
        job.salary = transformSalary(job.fromSalary, job.toSalary);
        job.company = _.pick(job.company, ['name', 'logoURL']);
        job.link = `${process.env.WEB_URL}/jobs/${job.id}`;
        return _.pick(job, ['id', 'title', 'company', 'link', 'skills', 'salary']);
      })

      const data = {
        subscribedSkills: _.join(subscribedSkills, ', '),
        jobs,
        userInfo: student
      }

      console.log('data: ', data);

      EmailService.sendToUser(user, 'job-alert-email', data)
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      })
    } catch (err) {
      console.log(err);
      return done(err);
    }
  }

  function transformSalary (fromSalary, toSalary) {
    if (!fromSalary) return `Up to ${toSalary}$`;
    return `${fromSalary}$ - ${toSalary}$`
  }
};
