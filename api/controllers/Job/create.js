const slugify = require('slugify');
const shortid = require('shortid');
const {
  isValidSalary,
  isValidJobType
} = require('../../../utils/validator');

const {
  INVALID_PARAMETERS,
  MISSING_PARAMETERS,
  INTERNAL_SERVER_ERROR
} = require('../../../constants/error-code');

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

  EmailService.sendToAdmins(admins, 'review-new-job-email', contentData);
};

module.exports = async function (req, res) {
  const companyId = _.get(req, "user.id");
  const company = _.get(req, "user");

  const { skillIds, title, description, categoryId, fromSalary, toSalary, requirements, jobType, benefits } = req.body;

  if (!title || !categoryId || !description || !requirements || !jobType) {
    return res.badRequest({
      message: "Missing parameters.",
      devMessage: "Some parameters are missing (`title` | `categoryId` | `description` | `requirements` | `jobType`).",
      code: MISSING_PARAMETERS,
      traceId: req.traceId
    });
  }

  if (!isValidSalary(fromSalary, toSalary)) {
    return res.badRequest({
      message: "Invalid Salary.",
      devMessage: "Invalid `fromSalary` and `toSalary` (they should be NUMBERIC, `fromSalary` <= `toSalary`).",
      code: INVALID_PARAMETERS,
      traceId: req.traceId
    });
  }

  if (!isValidJobType(jobType)) {
    return res.badRequest({
      message: "Invalid job type",
      devMessage: "Invalid job type (should be FULL_TIME or PART_TIME or INTERNSHIP or CONTRACT or FREELANCE.",
      code: INVALID_PARAMETERS,
      traceId: req.traceId
    });
  }

  try {
    const cleanTitle = _.escape(title.trim().toLowerCase());
    const slug = `${slugify(cleanTitle)}-${shortid.generate()}`;
    const job = await Job.create({
      company: companyId,
      slug,
      title,
      description,
      category: categoryId,
      skills: skillIds,
      requirements,
      fromSalary,
      toSalary,
      jobType,
      benefits,
    }).fetch();

    const category = await Category.findOne({ id: categoryId });
    const skills = await Skill.find({ id: skillIds });

    ElasticsearchService.create({
      type: 'Job',
      id: job.id,
      body: {
        company: company,
        slug,
        title,
        description,
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
        _juniorviec_: {
          createdTime: new Date().toISOString()
        }
      }
    });

    job.skills = skills;
    job.category = category;

    sendEmailToAdmin(job, company);

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      devMessage: err.message,
      code: INTERNAL_SERVER_ERROR
    })
  }
};
