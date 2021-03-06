/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',

  'get /auth/google': 'AuthController.authenticate',
  'get /auth/google/callback': 'AuthController.authcallback',

  'get /profile': 'ProfileController.myProfile',
  'get /profile/edit': 'ProfileController.edit',
  'post /profile/save': 'ProfileController.save',
  'get /profile/create': 'ProfileController.createUser',
  'post /profile/create': 'ProfileController.createUserSubmit',

  'get /admin': 'AdminController.index',
  'get /admin/students': 'AdminController.students',
  'get /admin/employees': 'AdminController.employees',

  'get /admin/terminate/:id': 'AdminController.terminate',
  'post /admin/terminate/:id': 'AdminController.terminateSave',

  'get /admin/expell/:id': 'AdminController.terminateStudent',
  'post /admin/expell/:id': 'AdminController.terminateStudentSave',

  'get /admin/edit/:id': 'AdminController.edit',
  'post /admin/edit/:id': 'AdminController.editSave',


  'get /test/getAllUsers' : 'TestController.getAllUsers',
  'get /test/getUserById' : 'TestController.getUserByIdForm',
  'post /test/getUserById' : 'TestController.getUserByIdSubmit',
  'get /test/getUserByEmail' : 'TestController.getUserByEmailForm',
  'post /test/getUserByEmail' : 'TestController.getUserByEmailSubmit',
  'get /test/createUser' : 'TestController.createUserForm',
  'post /test/createUser' : 'TestController.createUserSubmit',
  'get /test/updateUser' : 'TestController.updateUserForm',
  'post /test/updateUser' : 'TestController.updateUserSubmit',
};
