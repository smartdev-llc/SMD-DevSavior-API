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
  'auth/logout': 'isAuthenticated',

  // Job
  'job/find': true,
  'job/create': 'isCompany',
  'job/apply': 'isStudent',
  'job/search': true,
  'job/find-one': true,

  // Category
  'category/find': true,
  
  // Skill
  'skill/find': true,
  
  // Photo
  'photo/upload': true,
  'photo/read': true,
  'photo/delete': true,
  
  // Company
  'company/find': true,
  'company/find-one': true,
  'company/update-my-info': 'isCompany',
  'company/upsert-my-logo': 'isCompany',
  'company/upsert-my-cover': 'isCompany',
  
  // Student
  'student/find-one': true,

  // JobApplication
  'jobapplication/find': 'isCompany',

  // Profile
  'profile/find-me': 'isStudent',
  'profile/find-one': true,
  'profile/upsert-avatar': 'isStudent',
  'profile/upsert-personal-info': 'isStudent',
  'profile/upsert-basic-info': 'isStudent',
  'profile/upsert-working-preference': 'isStudent',
  'profile/upsert-skills': 'isStudent',
  'profile/upsert-languages': 'isStudent',

  // Client
  'common/contact-admin': true
};
