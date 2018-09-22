const moment = require('moment');

module.exports = async function (req, res) {

  const studentId = _.get(req, "user.id");

  const { subject, university, qualification, fromDate, toDate, achievements } = req.allParams();

  if (!subject || !university || !qualification) {
    return res.badRequest({
      message: "Missing parameters."
    });
  };

  if (fromDate && toDate) {
    if (!isValidDate(fromDate) || !isValidDate(toDate)) {
      return res.badRequest({
        message: "Invalid date type format"
      });
    }
  }

  if (!isBeforeDate(fromDate, toDate)) {
    return res.badRequest({
      message: "fromDate is not before toDate"
    });
  }

  try {
    var resume = await Resume.create({
      subject,
      university,
      qualification,
      fromDate,
      toDate,
      student: studentId
    }).fetch();
  } catch (err) {
    return res.serverError({
      message: `Something went wrong: ${err}`
    });
  };

  if (achievements && achievements.length > 0) {
    try {
      const newAchievements = _.map(achievements, element => {
        return _.assign({}, element, { award: resume.id });
      });

      const achievement = await Achievement.createEach(newAchievements);
    } catch (err) {
      return res.serverError({
        message: `Something went wrong: ${err}`
      });
    };

  };

  return res.ok({
    message: 'You have created your CV successfully'
  })
}

const isValidDate = date => {
  return moment(date, "YYYY-MM-DD").isValid()
}

const isBeforeDate = (fromDate, toDate) => {
  return moment(fromDate).isBefore(moment(toDate))
}