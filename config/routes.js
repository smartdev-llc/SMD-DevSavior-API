/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'pages/homepage'
  },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  'post /auth/signup': 'Auth.signup',
  'post /auth/login': 'Auth.login',
  'post /auth/logout': 'Auth.logout',
  'post /auth/verify': 'Auth.verify',
  'post /auth/forgot-password': 'Auth.forgot-password',
  'post /auth/reset-password': 'Auth.reset-password',
  'post /auth/change-password': 'Auth.change-password',
  'post /auth/:provider': 'Auth.social',
  'post /auth/resend-email': 'Auth.resend-email',

  'post /jobs/:jobId/applications': 'JobApplication.create',
  'get /jobs/:jobId/applications': 'JobApplication.find',
  'get /jobs/search': 'Job.search',
  'get /jobs/:slug/recommended': 'Job.recommend',
  'get /jobs/count': 'Job.count',
  'get /jobs/list-by-time': 'Job.list-by-time',
  'get /jobs/:slug': 'Job.find-one',
  'put /my-jobs/:id': 'Job.update-my-job',
  'put /jobs/:id/approve': 'Job.approve',
  'put /jobs/:id/reject': 'Job.reject',
  'put /jobs/:id/activate': 'Job.activate',
  'put /jobs/:id/deactivate': 'Job.deactivate',
  'put /jobs/:id/renew': 'Job.renew',
  'delete /jobs/:id': 'Job.delete',
  'post /jobs/alert-queues': 'Job.create-alert-queues',

  'post /jobs/sync': 'Job.sync-to-es',
  
  'post /photos/upload': 'Photo.upload',
  'get /photos/:photoName': {
    controller: 'Photo',
    action: 'read',
    skipAssets: false
  },
  'delete /photos/:photoName': 'Photo.delete',

  'get /companies/:slug/jobs': 'Job.find-by-company-id',
  'get /companies/search': "Company.search",
  'get /companies/:slug': "Company.find-one",
  'put /companies/:id/approve': 'Company.approve',
  'put /companies/:id/reject': 'Company.reject',
  'put /companies/:id/activate': 'Company.activate',
  'put /companies/:id/deactivate': 'Company.deactivate',
  'put /companies/:id/info': "Company.update-info",
  'put /companies/:id/logo': "Company.upsert-logo",
  'put /companies/:id/cover': "Company.upsert-cover",
  'post /companies/:id/photos': "Company.add-photo",
  'delete /companies/:id/photos/:photoName': "Company.delete-photo",
  'put /companies/:companyId/reviews': "Company.review",
  'get /companies/count': "Company.count",

  'get /students/search': "Student.search",
  'get /students/:studentId': 'Student.find-one',
  'get /profile/me': 'Student.find-me',
  'put /profile/me/avatar': 'Student.upsert-avatar',
  'put /profile/me/personal-info': 'Student.upsert-personal-info',
  'put /profile/me/basic-info': 'Student.upsert-basic-info',
  'put /profile/me/working-preference': 'Student.upsert-working-preference',
  'put /profile/me/skills': 'Student.upsert-skills',
  'put /profile/me/languages': 'Student.upsert-languages',
  'post /profile/me/education-degrees': 'Student.create-education-degree',
  'put /profile/me/education-degrees/:id': 'Student.update-education-degree',
  'delete /profile/me/education-degrees/:id': 'Student.delete-education-degree',
  'post /profile/me/working-experiences': 'Student.create-working-experience',
  'put /profile/me/working-experiences/:id': 'Student.update-working-experience',
  'delete /profile/me/working-experiences/:id': 'Student.delete-working-experience',
  'get /jobs/:jobId/applications/:applicantId': 'Student.find-applicant',
  'put /students/:id/activate': 'Student.activate',
  'put /students/:id/deactivate': 'Student.deactivate',
  'delete /students/:id': 'Student.delete',
  'get /students/count': 'Student.count',

  'post /contact': 'Common.contact',
  'get /test': 'Common.test',
  'get /slugify-companies': 'Common.slugify-companies',
  'get /slugify-jobs': 'Common.slugify-jobs',

  'post /skills/:skillId/subscriptions': 'SkillSubscription.create',
  'delete /skills/:skillId/subscriptions': 'SkillSubscription.delete',

  'get /skill-subscriptions': 'SkillSubscription.find',
  'put /hotjobs/:id/approve': 'HotJob.approve',
  'put /hotjobs/:id/reject': 'HotJob.reject',
  'put /hotjobs/:id/activate': 'HotJob.activate',
  'put /hotjobs/:id/deactivate': 'HotJob.deactivate',
  'get /hotjobs/:slug': 'HotJob.get',
  'get /bo/hotjobs': 'HotJob.find-all',


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝

};
