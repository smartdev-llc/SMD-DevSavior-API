var Promise = require("bluebird");
module.exports = async function (req, res) {
    try {
        const jobs = await Job
            .find({})
            .populate('skills', { select: ['id', 'name'] })
            .populate('category')
            .populate('company')
            .limit(1000)
            .skip(0);

        return Promise.each(jobs, job => {
            return ElasticsearchService.create({
                type: 'Job',
                id: job.id,
                body: {
                    company: _.pick(job.company, [
                        "id",
                        "name",
                        "address",
                        "city",
                        "contactName",
                        "logoURL",
                        "phoneNumber",
                        "slug"
                    ]),
                    title: job.title,
                    slug: job.slug,
                    description: job.description,
                    skills: job.skills,
                    category: _.pick(job.category, ['id', 'name']),
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
        }).then(() => res.ok(jobs));

    } catch (err) {
        return res.serverError({
            message: `Something went wrong .`,
            data: err
        });
    }
}