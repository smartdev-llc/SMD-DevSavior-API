/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const serveStatic = require('serve-static');
const uploadFolder = process.env.UPLOAD_FOLDER || '.tmp';

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
  'get /jobs/:jobId/recommended': 'Job.recommend',
  'get /jobs/count': 'Job.count',
  'put /jobs/:id': 'Job.update',
  'get /jobs/list-by-time': 'Job.list-by-time',
  'get /jobs/:id': 'Job.find-one',
  'put /my-jobs/:id': 'Job.update-my-job',
  'get /companies/:companyId/jobs': 'Job.find-by-company-id',
  'post /jobs/:jobId/status': 'Job.set-status',
  
  'post /photos/upload': 'Photo.upload',
  'get /photos/:photoName': {
    controller: 'Photo',
    action: 'read',
    skipAssets: false
  },
  'delete /photos/:photoName': 'Photo.delete',

  'get /companies/search': "Company.search",
  'get /companies/:id': "Company.find-one",
  'put /my-company/info': "Company.update-my-info",
  'put /my-company/logo': "Company.upsert-my-logo",
  'put /my-company/cover': "Company.upsert-my-cover",

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

  'post /contact': 'Common.contact',
  'get /test': 'Common.test',

  'post /skills/:skillId/subscriptions': 'SkillSubscription.create',
  'delete /skills/:skillId/subscriptions': 'SkillSubscription.delete',

  'get /skill-subscriptions': 'SkillSubscription.find',
  'put /hotjobs/:id/approve': 'HotJob.approve',

  
  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝
  
};
