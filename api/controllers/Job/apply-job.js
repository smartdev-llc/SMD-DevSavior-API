module.exports = async function(req, res) {
  try {
    const userId = _.get(req, 'user.id');
    if (!userId) {
      return res.unauthorized({
        message: "You need to login as a user to apply a new job."
      });
    }

    const { jobId } = req.allParams();

    if (!jobId) {
      return res.badRequest({
        message: "Missing parameters."
      })
    }
    
    const users = await Job.findOne({ id: jobId }).populate("students")

    const students = _.get(users, 'students')

    const studentIds = _.chain(students).map('id').concat(_.parseInt(userId)).value()
    
    await Job.update({ id: jobId })
          .set({ students: studentIds });

    res.ok()

  } catch(err) {
    res.serverError(err);
  }
}
