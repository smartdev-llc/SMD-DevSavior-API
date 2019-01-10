const moment = require("moment");
const constants = require("../../../constants");
const { MAXIMUM_ELEMENT_COUNT } = constants;

module.exports = async function (req, res) {
  let { size, page } = _.get(req, 'query');
  let limit = parseInt(size) || 10;
  let skip = (parseInt(page) || 0) * limit;
  let sort = 'createdAt DESC';
  try {
    const jobs = await HotJob
      .find({})
      .populate("job")
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await HotJob.count({});

    return res.ok({
      total,
      list: jobs,
      size: limit,
      from: skip
    });
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      code: "INTERNAL_SERVER_ERROR",
      error: err.stack
    });
  }
};
