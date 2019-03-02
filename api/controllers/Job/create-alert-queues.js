module.exports = async function (req, res) {
  CronTaskService.sendJobAlerts();
  res.ok({
    message: "Job alert queues are created."
  });
}