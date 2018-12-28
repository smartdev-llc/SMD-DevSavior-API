const Kue = require('kue');
const path = require('path');
const _ = require('lodash');

let queue = Kue.createQueue({
  prefix: 'q',
  redis: `${process.env.REDIS_URL}/${process.env.REDIS_DB_FOR_KUE}`
});

Kue.app.listen(process.env.KUE_APP_PORT || 3005);
Kue.app.set('title', 'JuniorViec Queue');

queue.on( 'error', function( err ) {
  console.log( 'Oops... ', err );
});

console.log(path.resolve(__dirname, '../jobs'));

var jobProcesses = require('include-all')({
  dirname     :  path.resolve(__dirname, '../jobs'),
  filter      :  /(.+)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  optional    :  true
});

_.forEach(jobProcesses, jobProcess => jobProcess(queue)); 

queue
  .on('job enqueue', function (id, type) {
    console.log('Job %s got queued of type %s', id, type);
  })
  .on('job complete', function (id, result) {
    Kue.Job.get(id, function(err, job){
      if (err) return;

      console.log("job #%d completed", job.id);
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  });

//fix stuck jobs every 30 secs
queue.watchStuckJobs();

process.once('SIGTERM', (sig) => {
	queue.shutdown(5000, (err) => {
		console.log('Kue is shut down.', err || '');
		process.exit(0);
	});
});

module.exports = {
  queue
};