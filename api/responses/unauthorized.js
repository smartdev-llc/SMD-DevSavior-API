/**
 * Module dependencies
 */

// n/a



/**
 * 401 (Unauthorized) Handler
 *
 * Usage:
 * return res.unauthorized();
 *
 * e.g.:
 * ```
 * return res.unauthorized();
 * ```
 */

module.exports = function unauthorized () {

  // Get access to `res`
  var res = this.res;

  // Send status code and "Unauthorized" message
  return res.sendStatus(401);

};
