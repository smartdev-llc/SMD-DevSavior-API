var Promise = require("bluebird");
module.exports = async function (req, res) {
  try {
    const jobs = await Job
            .find({})
            .populate("skills", { select: ["id", "name"] })
            .populate("category")
            .populate("company")
            .limit(1000)
            .skip(0);

    return Promise.each(jobs, job => {
      let doc = {
        company: _.pick(job.company, [
          "id",
          "name",
          "address",
          "city",
          "contactName",
          "logoURL",
          "phoneNumber"
        ]),
        title: job.title,
        description: job.description,
        skills: job.skills,
        category: _.pick(job.category, ["id", "name"]),
        status: job.status,
        requirements: job.requirements,
        fromSalary: job.fromSalary,
        toSalary: job.toSalary,
        jobType: job.jobType,
        benefits: job.benefits,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      };
      return ElasticsearchService.update({
        type: "Job",
        id: job.id,
        body: {
          doc: _.merge({
            _juniorviec_: {
              updatedTime: new Date().toISOString()
            }
          }, doc),
          upsert: _.merge({
            _juniorviec_: {
              createdTime: new Date().toISOString(),
              updatedTime: new Date().toISOString()
            }
          }, doc)
        }
      });
    }).then(() => res.ok(jobs));
  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`,
      data: err
    });
  }
};
