module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");

  if (userId && role == 'company') {
    await findByCompanyId(req, res, userId);
  } else {
    await findAll(req, res);
  }
}

const findByCompanyId = async (req, res, userId) => {
  try {
    const job = await Job
      .find({ company: userId })
      .populate('students', { select: ['id', 'firstName', 'lastName'] })
      .populate('skills', { select: ['id', 'name'] })
      .populate('category');

    if (!job) {
      return res.badRequest({
        message: 'Job is not found'
      });
    }

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`
    });
  }
}

const findAll = async (req, res) => {
  try {
    const job = await Job
      .find({})
      .populate('students', { select: ['id', 'firstName', 'lastName'] })
      .populate('skills', { select: ['id', 'name'] })
      .populate('category');

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`
    });
  }
}