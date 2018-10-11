module.exports = async function (req, res) {
  try {
    const { qs, size, page } = _.get(req, 'query');
    const queryBody = _.pick(req.query, ['qs', 'category']);
    let limit = parseInt(size) || 10;
    let skip = (parseInt(page) || 0) * limit;

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
	"size": limit,
        "from": skip,
        "query": query
      }
    });

    res.ok(_.extend(result, { size: limit, from: skip }));
  } catch (err) {
    res.serverError(err);
  }
}
