const slugify = require('slugify');
const shortid = require('shortid');
const {
  isValidSalary,
  isValidJobType
} = require('../../../utils/validator');

const {
  INVALID_PARAMETERS,
  MISSING_PARAMETERS,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { ACTIVE, PENDING } = constants.STATUS;

const moment = require('moment');

const sendEmailToAdmin = (job, company) => {
  const contentData = {
    job: _.pick(job, ['id', 'title']),
    company: _.pick(company, ['id', 'name']),
    jobLink: `${process.env.BO_URL}/dashboard/jobs/${job.id}`
  };
  const admins = _.map(_.split(process.env.ADMIN_EMAILS, ','), email => {
    return {
      email
    };
  });

  EmailService.sendToAdmins(admins, 'job-is-edited-email', contentData);
};

module.exports = async function (req, res) {
  const company = _.get(req, "user");
  const id = _.get(req, "params.id");
  const {
    skillIds,
    title,
    description,
    categoryId,
    fromSalary,
    toSalary,
    requirements,
    jobType,
    benefits
  } = req.body;

  if (!description || !requirements || !jobType || !skillIds || !title || !categoryId) {
    return res.badRequest({
      message: MISSING_PARAMETERS
    });
  }

  if (!isValidSalary(fromSalary, toSalary)) {
    return res.badRequest({
      message: "Invalid Salary.",
      devMessage: "Invalid `fromSalary` and `toSalary` (they should be NUMBERIC, `fromSalary` <= `toSalary`).",
      code: INVALID_PARAMETERS
    });
  }

  if (!isValidJobType(jobType)) {
    return res.badRequest({
      message: "Invalid job type",
      devMessage: "Invalid job type (should be FULL_TIME or PART_TIME or INTERNSHIP or CONTRACT or FREELANCE.",
      code: INVALID_PARAMETERS
    });
  }

  let foundJob;

  try {
    foundJob = await Job.findOne({
      id,
      company: company.id,
    });

    if (!foundJob) {
      return res.notFound({
        message: "Job not found."
      });
    }

    if (_.indexOf([ACTIVE, PENDING], foundJob.status) < 0) {
      return res.badRequest({
        message: "Invalid job status",
        devMessage: "Invalid job status (should be ACTIVE or PENDING).",
        code: BAD_REQUEST
      });
    }

    if (foundJob.status === ACTIVE && foundJob.expiredAt < moment.now()) {
      return res.badRequest({
        message: "Invalid job.",
        devMessage: "Job is expired.",
        code: INVALID_PARAMETERS
      });
    }
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }

  let updatedBody = {
    title,
    slug: foundJob.slug,
    description,
    category: categoryId,
    skills: skillIds,
    requirements,
    fromSalary,
    toSalary,
    jobType,
    benefits
  };

  if (title !== foundJob.title) {
    const cleanTitle = _.escape(job.title.trim().toLowerCase());
    updatedBody.slug = `${slugify(cleanTitle)}-${shortid.generate()}`;
  }

  try {
    let job = await Job.updateOne({ id })
      .set(updatedBody);

    const skills = await Skill.find({ id: skillIds });
    const category = await Category.findOne({ id: categoryId });

    ElasticsearchService.update({
      type: 'Job',
      id: id,
      body: {
        doc: {
          title: job.title,
          slug: job.slug,
          description: job.description,
          skills: _.map(skills, skill => _.pick(skill, ['name', 'id'])),
          category: {
            id: category.id,
            name: category.name
          },
          status: job.status,
          requirements: job.requirements,
          fromSalary: job.fromSalary,
          toSalary: job.toSalary,
          jobType: job.jobType,
          benefits: job.benefits,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        }
      }
    });

    job.skills = skills;
    job.category = category;

    sendEmailToAdmin(job, company);

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`,
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    });
  }
};
