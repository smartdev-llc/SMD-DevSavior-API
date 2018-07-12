module.exports = async function(req, res) {
    const foundJob =  await Job.find({});
    res.ok(foundJob);
}