/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)
  * Available policies: isStudent, isCompany                                 *
  *                                                                          *
  ***************************************************************************/

  '*': false, // set to admin later

  // Auth
  'auth/*': true,
  'auth/change-password': 'isAuthenticated',
  'auth/logout': 'isAuthenticated',

  // Job
  'job/find': true,
  'job/create': 'isCompany',
  'job/count': 'isCompany',
  'job/list-by-time': 'isCompany',
  'job/search': true,
  'job/recommend': true,
  'job/find-one': true,
  'job/update-my-job': 'isCompany',
  'job/find-by-company-id': true,
  'job/approve': 'isAdmin',
  'job/reject': 'isAdmin',
  'job/activate': 'isAdmin',
  'job/deactivate': 'isAdmin',
  'job/renew': 'isAdmin',
  'job/delete': 'isAuthenticated',
  'job/create-alert-queues': 'isAdmin',

  // Category
  'category/find': true,
  'category/create': 'isAdmin',
  
  // Skill
  'skill/find': true,
  'skill/create': 'isAdmin',

  // SkillSubscription
  'skillsubscription/create': 'isStudent',
  'skillsubscription/delete': 'isStudent',
  'skillsubscription/find': 'isStudent',
  
  // Photo
  'photo/upload': true,
  'photo/read': true,
  'photo/delete': true,
  
  // Company
  'company/find': true,
  'company/search': 'isAdmin',
  'company/find-one': true,
  'company/update-info': 'isCompanyOrAdmin',
  'company/upsert-logo': 'isCompanyOrAdmin',
  'company/upsert-cover': 'isCompanyOrAdmin',
  'company/add-photo': 'isCompanyOrAdmin',
  'company/delete-photo': 'isCompanyOrAdmin',
  'company/approve': 'isAdmin',
  'company/reject': 'isAdmin',
  'company/activate': 'isAdmin',
  'company/deactivate': 'isAdmin',
  
  // Student
  'student/search': 'isAdmin',
  'student/find-me': 'isStudent',
  'student/find-one': 'isAdmin',
  'student/upsert-avatar': 'isStudent',
  'student/upsert-personal-info': 'isStudent',
  'student/upsert-basic-info': 'isStudent',
  'student/upsert-working-preference': 'isStudent',
  'student/upsert-skills': 'isStudent',
  'student/upsert-languages': 'isStudent',
  'student/create-education-degree': 'isStudent',
  'student/update-education-degree': 'isStudent',
  'student/delete-education-degree': 'isStudent',
  'student/create-working-experience': 'isStudent',
  'student/update-working-experience': 'isStudent',
  'student/delete-working-experience': 'isStudent',
  'student/find-applicant': 'isCompany',

  // JobApplication
  'jobapplication/find': 'isCompany',
  'jobapplication/create': 'isStudent',

  // Common
  'common/*': true,

  // HotJob
  'hotjob/get': 'isAdmin',
  'hotjob/create': 'isCompany',
  'hotjob/approve': 'isAdmin',
  'hotjob/reject': 'isAdmin',
  'hotjob/activate': 'isAdmin',
  'hotjob/deactivate': 'isAdmin',
  'hotjob/find': true,
  'hotjob/find-all': 'isAdmin',
  
};
