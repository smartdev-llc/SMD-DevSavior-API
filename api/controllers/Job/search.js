module.exports = async function (req, res) {
  try {
    const qs = _.get(req, 'query.qs');
    const queryBody = _.pick(req.query, ['qs', 'category']);

    const buildQuery = ElasticsearchService.buildQuery(queryBody);

    let query = { bool: { must: [] } };
    
    query.bool.must.push(buildQuery.activeJob());
    query.bool.must.push(buildQuery.identifiers({
      nestedIdNames: [{
        request: 'category',
        path: 'category',
        field: 'category.id'
      }],
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