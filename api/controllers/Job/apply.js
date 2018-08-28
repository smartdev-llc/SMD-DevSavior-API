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
    
    const job = await Job.findOne({ id: jobId }).populate("students")

    if (!job) {
      return res.badRequest({
        message: 'Job is not found'
      })
    }

    await Job.addToCollection(_.parseInt(jobId), 'students')
            .members([_.parseInt(userId)]);

    res.ok()
  } catch(err) {
    res.serverError(err);
  }
}
