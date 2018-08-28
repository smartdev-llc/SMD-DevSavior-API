module.exports = async function(req, res) {
  try {
    const userId = _.get(req, 'user.id');
    if (!userId) {
      return res.unauthorized({
        message: "You need to login as a user to apply a new job."
      });
    }

    const { jobId } = req.params;

    if (!jobId) {
      return res.badRequest({
        message: "Missing parameters."
      });
    }
    
    try {
      const job = await Job.findOne({ id: jobId });

      if (!job) {
        return res.badRequest({
          message: 'Job is not found'
        })
      }
    } catch(err) {
      return res.serverError(err);
    }

    try {
      await Job.addToCollection(jobId, 'students')
               .members([userId]);
    } catch(err) {
      return res.serverError(err);
    }

    res.ok({
      message: "Applied successfully."
    })
  } catch(err) {
    res.serverError(err);
  }
}
