const debuglog = require("debug")("jv:job:search");

module.exports = async function (req, res) {
  try {
    const { qs, size, page } = _.get(req, "query");
    let queryBody = _.pick(req.query, ["qs", "category", "jobTypes", "skills"]);
    let limit = parseInt(size) || 10;
    let skip = (parseInt(page) || 0) * limit;

    const userId = _.get(req, "user.id");
    const role = _.get(req, 'user.role');

    if (role === 'company') {
      queryBody.company = userId;
    }

    const buildQuery = ElasticsearchService.buildQuery(queryBody);
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

    let nestedIdNames = [{
      request: "category",
      path: "category",
      field: "category.id"
    }];
    if (userId && role === 'company') {
      nestedIdNames.push({
        request: "company",
        path: "company",
        field: "company.id"
      });
    }

    query.bool.must = query.bool.must.concat(buildQuery.identifiers({
      nestedIdNames
    }));
    query.bool.must.push(buildQuery.textSearch({
      text: qs,
      options: {
        keys: ["title"],
        nestedKeys: [
          "skills.name",
          "category.name",
        ]
      }
    }));
    query.bool.must.push(buildQuery.multiChoices({
      request: "jobTypes",
      field: "jobType"
    }));
    query.bool.must.push(buildQuery.multiChoices({
      type: "nested",
      request: "skills",
      field: "skills.id",
      path: "skills"
    }));
    query.bool.must = _.compact(query.bool.must);
    debuglog("query: ", JSON.stringify(query));
    let result = await ElasticsearchService.search({
      type: "Job",
      body: {
        "size": limit,
        "from": skip,
        "query": query
      }
    }).then(transformResult.getHits);

    res.ok(_.extend(result, { size: limit, from: skip }));
  } catch (err) {
    res.serverError(err);
  }
};
