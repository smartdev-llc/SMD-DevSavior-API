const {
  INTERNAL_SERVER_ERROR,
  PERMISSION_DENIED
} = require('../../../constants/error-code');

module.exports = async function (req, res) {
  const role = _.get(req, "user.role");
  const { qs } = req.query;
  if (role !== 'admin') {
    return res.forbidden({
      message: "Permission denied.",
      devMessage: "You should login as admin.",
      code: PERMISSION_DENIED
    })
  }

  const { size, page } = _.get(req, 'query');
  const limit = parseInt(size) || 10;
  const skip = (parseInt(page) || 0) * limit;
  let where = {};

  if (qs) {
    where = {
      "or": [
        { email: { contains: qs } },
        { displayName: { contains: qs } }
      ]
    };
  }

  try {
    const total = await Student.count({}).where(where);

    const students = await Student.find({})
      .where(where)
      .limit(limit)
      .skip(skip)
      .sort('createdAt DESC')
      .populate('workingPreference')
      .populate('workingExperiences')
      .populate('educationDegrees');

    res.ok({
      total,
      list: students,
      size,
      page
    });
  } catch (err) {
    return res.serverError({
      code: INTERNAL_SERVER_ERROR,
      message: "Something went wrong.",
      devMessage: err.message
    })
  }

}