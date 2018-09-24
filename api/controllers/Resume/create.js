const moment = require('moment');

module.exports = async function (req, res) {

  const studentId = _.get(req, "user.id");

  const { subject, university, qualification, fromDate, toDate, achievements } = req.allParams();

  const checkYourCVExist = await Resume.findOne({
    student: studentId
  });

  if (checkYourCVExist) {
    return res.conflict({
      message: "Your CV already created."
    });
  }

  if (!subject || !university || !qualification) {
    return res.badRequest({
      message: "Missing parameters."
    });
  };

  if (fromDate && toDate) {
    if (!isValidDate(fromDate) || !isValidDate(toDate)) {
      return res.badRequest({
        message: "Invalid date"
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

  if (_.isArray(achievements) && _.size(achievements) > 0) {
    try {
      const newAchievements = _.map(achievements, element => {
        return _.assign({}, element, { award: resume.id });
      });

      await Achievement.createEach(newAchievements);
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