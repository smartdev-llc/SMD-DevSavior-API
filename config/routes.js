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
  'post /auth/:provider': 'Auth.social',
  'post /auth/resend-email': 'Auth.resend-email',

  'post /jobs/:jobId/applications': 'Job.apply',
  'get /jobs/:jobId/applications': 'JobApplication.find',
  'get /jobs/search': 'Job.search',
  'get /jobs/count': 'Job.count',
  'get /jobs/:id': 'Job.find-one',
  'put /my-jobs/:id': 'Job.update-my-job',
  'get /companies/:companyId/jobs': 'Job.find-by-company-id',

  'post /photos/upload': 'Photo.upload',
  'get /photos/:photoName': {
    controller: 'Photo',
    action: 'read',
    skipAssets: false
  },
  'delete /photos/:photoName': 'Photo.delete',

  'get /companies/:id': "Company.find-one",
  'put /my-company/info': "Company.update-my-info",
  'put /my-company/logo': "Company.upsert-my-logo",
  'put /my-company/cover': "Company.upsert-my-cover",

  'get /students/:id': "Student.find-one",
  'get /students/search': "Student.search",

  'get /profile/me': 'Profile.find-me',
  'get /profile/:studentId': 'Profile.find-one',
  'put /profile/me/avatar': 'Profile.upsert-avatar',
  'put /profile/me/personal-info': 'Profile.upsert-personal-info',
  'put /profile/me/basic-info': 'Profile.upsert-basic-info',
  'put /profile/me/working-preference': 'Profile.upsert-working-preference',
  'put /profile/me/skills': 'Profile.upsert-skills',
  'put /profile/me/languages': 'Profile.upsert-languages',
  'post /profile/me/education-degrees': 'Profile.create-education-degree',
  'put /profile/me/education-degrees/:id': 'Profile.update-education-degree',
  'delete /profile/me/education-degrees/:id': 'Profile.delete-education-degree',
  'post /profile/me/working-experiences': 'Profile.create-working-experience',
  'put /profile/me/working-experiences/:id': 'Profile.update-working-experience',
  'delete /profile/me/working-experiences/:id': 'Profile.delete-working-experience',

  'post /contact': 'Common.contact-admin'
  
  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝
  
};
