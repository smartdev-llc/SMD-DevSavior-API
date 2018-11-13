const debuglog = require("debug")("jv:job:search");
const constants = require('../../../constants');
const { FULL_TIME, PART_TIME, INTERSHIP, CONTRACT, FREELANCE } = constants.JOB_TYPE;

module.exports = async function (req, res) {
  try {
    const { qs, size, page } = _.get(req, 'query');
    const queryBody = _.pick(req.query, ['qs', 'category', 'jobTypes']);
    let limit = parseInt(size) || 10;
    let skip = (parseInt(page) || 0) * limit;

    const buildQuery = ElasticsearchService.buildQuery(queryBody);
    const transformResult = ElasticsearchService.transformResult();

    let query = { bool: { must: [] } };

    query.bool.must.push(buildQuery.activeJob());
    query.bool.must = query.bool.must.concat(buildQuery.identifiers({
      nestedIdNames: [{
        request: 'category',
        path: 'category',
        field: 'category.id'
      }]
    }));
    query.bool.must.push(buildQuery.textSearch({
      text: qs,
      options: {
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
    query.bool.must = _.compact(query.bool.must);
    debuglog('query: ', JSON.stringify(query));
    let result = await ElasticsearchService.search({
      type: 'Job',
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
}
