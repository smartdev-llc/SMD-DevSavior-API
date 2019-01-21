/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  const numberOfSkills = await Skill.count();

  if (numberOfSkills === 0) {
    await Skill.createEach([
      { name: 'Java' },
      { name: 'Android' },
      { name: 'IOS' },
      { name: 'NodeJS' },
      { name: 'PHP' },
      { name: '.NET' },
      { name: 'AngularJS' },
      { name: 'React Native' },
      { name: 'ReactJS' },
      { name: 'Automation Testing' },
      { name: 'Manual Testing' },
      { name: 'Python' },
      { name: 'Ruby' },
      { name: 'AI' },
      { name: 'Blockchain' },
      { name: 'VueJS' },
      { name: 'Web Design' },
    ]);
  }

  const numberOfCategories = await Category.count();

  if (numberOfCategories === 0) {
    await Category.createEach([
      { name: 'Backend Developer' },
      { name: 'Frontend Developer' },
      { name: 'Designer' },
      { name: 'Tester' },
      { name: 'FullStack' },
    ]);
  }

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
