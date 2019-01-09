const moment = require("moment");
const constants = require("../../../constants");
const { MAXIMUM_ELEMENT_COUNT } = constants;
module.exports = async function (req, res) {
  try {
    const jobs = await HotJob
      .find({
        expiredDay: { ">=": moment.now() }
      })
      .populate("job")
      .limit(MAXIMUM_ELEMENT_COUNT);

    return res.ok(jobs);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong.",
      error: err
    });
  }
};
