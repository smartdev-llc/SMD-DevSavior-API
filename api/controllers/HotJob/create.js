const { isValidExpiredDay } = require('../../../utils/validator');
const constants = require('../../../constants')
const { ONE_WEEK, TWO_WEEKS, ONE_MONTH } = constants.EXPIRED_DAY;
const moment = require('moment');

module.exports = async function (req, res) {
  const { expiredDay, jobId } = req.body;

  if (!expiredDay || !jobId) {
    return res.badRequest({
      message: "Missing parameters."
    });
  }

  if (!isValidExpiredDay(expiredDay)) {
    return res.badRequest({
      message: "Invalid expiredDay type (should be ONE_WEEK or TWO_WEEKS or ONE_MONTH."
    });
  }

  try {
    const job = await HotJob.create({
      job: jobId,
      expiredDay: transformExpiredDay(expiredDay),
    }).fetch();

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
};

const transformExpiredDay = type => {
  switch (type) {
    case ONE_WEEK: return moment().add(1, 'w').valueOf();
    case TWO_WEEKS: return moment().add(2, 'w').valueOf();
    case ONE_MONTH: return moment().add(1, 'M').valueOf();
  }
}
