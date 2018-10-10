module.exports = async function (req, res) {
  const userId = _.get(req, "user.id");
  const role = _.get(req, "user.role");
  const id = _.get(req, "params.id");

  if (userId && role == 'company') {
    await findByCompanyId(req, res, userId, id);
  } else {
    await findByNormalUser(req, res, id);
  }
}

const findByCompanyId = async (req, res, userId, id) => {
  try {
    const job = await Job
      .find({ id, company: userId })
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

const findByNormalUser = async (req, res, id) => {
  try {
    const job = await Job
      .find({ id })
      .populate('skills', { select: ['id', 'name'] })
      .populate('category');

    return res.ok(job);
  } catch (err) {
    return res.serverError({
      message: `Something went wrong .`
    });
  }
}