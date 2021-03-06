const { isValidExpiredDay } = require("../../../utils/validator");
const constants = require("../../../constants");
const { ONE_WEEK, TWO_WEEKS, ONE_MONTH } = constants.EXPIRED_DAY;
const { MAXIMUM_ELEMENT_COUNT } = constants;
const moment = require("moment");

/*
 - only 1 hotjob for each company
 - default duration is 1 day
 - default status is PENDING
 - need BO's operator to approve
*/

const transformExpiredDay = (initialExpiredDay, type) => {
  if (!initialExpiredDay) {
    initialExpiredDay = moment.now();
  }
  switch (type) {
    case ONE_WEEK: return moment(initialExpiredDay).add(1, "w").valueOf();
    case TWO_WEEKS: return moment(initialExpiredDay).add(2, "w").valueOf();
    case ONE_MONTH: return moment(initialExpiredDay).add(1, "M").valueOf();
  }
};

module.exports = async function (req, res) {
  const { expiredDay, jobId } = req.body;
  let isCreated; let initialExpiredDay; let id;
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
    const job = await Job.findOne({ id: jobId });

    if (!job) {
      return res.notFound({
        message: "Job not found."
      });
    }
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }


  // Kiem tra so luong hotjob trong db da dat 15 hay chua
  try {
    const jobs = await HotJob.find({
      expiredDay: { ">": moment.now() }
    });

    if (_.size(jobs) >= MAXIMUM_ELEMENT_COUNT) {
      return res.forbidden({
        message: "Warning!! Hotjobs reach the limit."
      });
    }
  } catch (err) {
    return res.serverError({
      message: `Something went wrong.`
    });
  }

  // Kiem tra hotjob da duoc tao hay chua
  try {
    const job = await HotJob.findOne({ job: jobId });

    if (job) {
      isCreated = true;
      initialExpiredDay = _.parseInt(_.get(job, "expiredDay"));
      id = _.get(job, "id");
    } else {
      isCreated = false;
      initialExpiredDay = null;
    }

  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  // TH hotjob da duoc tao: tang so ngay
  if (isCreated) {
    try {
      const hotjob = await HotJob.update({ id })
      .set({ expiredDay: transformExpiredDay(initialExpiredDay, expiredDay) })
      .fetch();

      return res.ok(_.get(hotjob, "0"));
    } catch (err) {
      return res.serverError({
        message: `Something went wrong.`
      });
    }
  }

  // TH chua duoc tao: bat dau tao
  try {
    const job = await HotJob.create({
      job: jobId,
      expiredDay: transformExpiredDay(initialExpiredDay, expiredDay),
    }).fetch();
    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }
};
