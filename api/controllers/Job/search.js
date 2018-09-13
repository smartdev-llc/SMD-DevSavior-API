module.exports = async function (req, res) {
  try {
    const qs = _.get(req, 'query.qs');

    const buildQuery = ElasticsearchService.buildQuery();

    let query = { bool: { must: [] } };
    query.bool.must.push(buildQuery.activeJob());
    query.bool.must.push(buildQuery.textSearch({
      text: qs,
      keys: [
        "skills",
        "category",
      ]
    }));

    let result = await ElasticsearchService.search({
      type: 'Job',
      body: {
        "query": query
      }
    });

    res.ok(result);
  } catch (err) {
    res.serverError(err);
  }
}