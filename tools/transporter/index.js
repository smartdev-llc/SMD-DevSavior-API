const elasticsearch = require('elasticsearch');
const Promise = require('bluebird');
const config = require("config");
let es = new elasticsearch.Client(config.elasticsearch.connection);
const esClient = Promise.promisifyAll(es, { context: es });

const mysql = require("mysql");

var connection = mysql.createConnection(config.mysql.connection);

Promise.promisify(connection.query, {
    context: connection
})('SELECT * from job;').then((jobs, fields) => {
    return Promise.each(jobs, job => {
        return esClient.create({
            type: 'Job',
            id: job.id,
            body: {
                company: company,
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
                benefits: job.benefits
            }
        });
    })


});