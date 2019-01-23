const isCronJobEnabled = (process.env.CRON_JOB_STATUS === 'ACTIVE');

module.exports.cron = {
  sendJobAlerts: {
    schedule: '0 0 0 * * sun',
    onTick: () => CronTaskService.sendJobAlerts(),
    start: true,
    runOnInit: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  }
}