/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	makeAdmin: function (req, res) {
		User.findOne({id:req.session.passport.user})
      .exec(function findOneUserCB(err, user){
        if (!err) {
        	user.type = 'admin';
            //finish updating event
            user.save(function(err,updatedUser){
              if(err){
                console.log(err);
              } else {
                req.flash('success', 'Success.User.Update');
                res.redirect('/admin');
              }
            });
        } else {
          console.log(err);
          res.status(404);
        }
      });
	},

	makeAdmin: function (req, res) {
		User.findOne({id:req.session.passport.user})
      .exec(function findOneUserCB(err, user){
        if (!err) {
        	user.type = 'Student';
            //finish updating event
            user.save(function(err,updatedUser){
              if(err){
                console.log(err);
              } else {
                req.flash('success', 'Success.User.Update');
                res.redirect('/');
              }
            });
        } else {
          console.log(err);
          res.status(404);
        }
      });
	},

	index: function (req, res) {
		User.findOne({id:req.session.passport.user}).exec(function findOneUserCB(err, user){
      	if (!err) {
			res.view('admin', {
				user: user,
				errors: err,
			});
		} else {
			res.status(403);
		}
	});
	},

	students: function (req, res) {
		User.findOne({id:req.session.passport.user}).exec(function findOneUserCB(err, user){
			var http = require('http');

			var options = {
		      hostname: 'vm344e.se.rit.edu',
		      port: 80,
		      path: '/api/User.php?action=get_all_users',
		      method: 'GET',
		    };

			http.request(options, function(response) {
		    var responseData = '';
		    response.setEncoding('utf8');

		    response.on('data', function(chunk){
		      responseData += chunk;
		    });

		    response.once('error', function(err){
		      // Some error handling here, e.g.:
		      res.serverError(err);
		    });

		    response.on('end', function(){
		      try {
		        // response available as `responseData` in `yourview`
		        res.locals.requestData = JSON.parse(responseData);
		      } catch (e) {
		        sails.log.warn('Could not parse response from options.hostname: ' + e);
		      }

		      res.view('students', {
		      	responseData: res.locals.requestData,
		      	user: user,
		      	errors: err,
		      });
		    });
		  }).end();
		});
	},

	employees: function (req, res) {
		User.findOne({id:req.session.passport.user}).exec(function findOneUserCB(err, user){
			// Get list of employees
			User.find({type: 'employee', isTerminated: false}).exec(function (err, employees) {
				res.view('employees', {
		      	employees: employees,
		      	user: user,
		      	errors: err,
		      });
			}); 
		});
	},

	terminate: function (req, res) {
		User.findOne({id:req.session.passport.user}).exec(function findOneUserCB(err, user){
			// Get user for termination request
			User.findOneById(req.param('id')).exec(function(err, user){
				res.view('terminate',{ user: user });
			});
		});
	},

	terminateSave: function (req, res) {
		User.update({id:req.param('id')},{isTerminated: true}).exec(function(err, updatedUser){
			if (err) {
				console.log(err);
			} else {
				// Saved!

				// Set isActive bool to 0 in central db
				CentralDatabaseService.getUserByGoogleId(updatedUser[0].userId, function(error, response) {
					CentralDatabaseService.setUserInactive(response[0]['UserID'], function(error, user) {
					});
				});

				req.flash('success', 'Employee was successfully terminated.');
				return res.redirect('/admin/employees');
			}
		});
	},

	terminateStudent: function (req, res) {
		User.findOne({id:req.session.passport.user}).exec(function findOneUserCB(err, user){
			// Get user for termination request
			User.findOne({userId: req.param('id')}).exec(function(err, student){
				sails.log(student);
				res.view('expell',{ user: student });
			});
		});
	},

	terminateStudentSave: function (req, res) {
		User.update({userId:req.param('id')},{isTerminated: true}).exec(function(err, updatedUser){
			if (err) {
				console.log(err);
			} else {
				// Saved!

				// Set isActive bool to 0 in central db
				CentralDatabaseService.getUserByGoogleId(updatedUser[0].userId, function(error, response) {
					CentralDatabaseService.setUserInactive(response[0]['UserID'], function(error, user) {
					});
				});

				req.flash('success', 'Student was successfully expelled.');
				return res.redirect('/admin/students');
			}
		});
	},

	edit: function (req, res) {
		User.findOne({id:req.session.passport.user}).exec(function findOneUserCB(err, user){
			// Get user for termination request
			User.findOneById(req.param('id')).exec(function(err, user){
				res.view('adminEdit',{ user: user, errors: err });
			});
		});
	},

	editSave: function (req, res) {
		User.findOne({id:req.param('id')})
      .exec(function findOneUserCB(err, user){
			if (!err) {
	          if (req.body.dateOfBirth) {
	            var userValidationRes = UserValidationService.validateUserDateOfBirth(user, req.body.dateOfBirth);
	            //throw any validation errors found
	            if(!userValidationRes.isValid){
	                
	                //return view with error message
	                req.flash('error', userValidationRes.err);
	                console.log(userValidationRes.err);
	                return res.view('edit',{
	                    actionTitle: 'Edit',
	                    action: 'edit',
	                    user: user,
	                    errors: req.flash('error')
	                });
	            } else {
	              user.dateOfBirth = req.body.dateOfBirth;
	            }
	        }

            if (req.body.address) {
               user.address = req.param('address');
            }

            if (req.body.position != user.position) {
               user.position = req.param('position');

               var positionStr = '';

               switch(user.position) {
               	case 'Professor':
               	positionStr = 'OEUM001018000000025108104';
               	break;
               	case 'Adjunct Professor':
               	positionStr = 'OEUM001018000000025000004';
               	break;
               	case 'Administrator':
               	positionStr = 'OEUM001018000000011903304'; 
               	break;
               	case 'Network Administrator':
               	positionStr = 'OEUM001018000000011302104';
               	break;
               	default:
               	positionStr = '';
               }

               SalaryService.getSalary(positionStr, function(error, salary) {
               		sails.log("Service call " + salary);
		            if (salary != -1) {
		    			user.salary = salary;
		    		}

		    		// Update with new salary
		            user.save(function(err,updatedUser){
		              if(err){
		                console.log(err);
		              } else {

		              	// TODO: Use CentralDBService to update user

		                req.flash('success', 'Success.User.Update');
		                res.redirect('/admin/employees');
		              }
		            });
               });
               
            } else {

            	// Update user with the same salary
		        user.save(function(err,updatedUser){
		          if(err){
		            console.log(err);
		          } else {

		          	// TODO: Use CentralDBService to update user

		            req.flash('success', 'Success.User.Update');
		            res.redirect('/admin/employees');
		          }
		        });

		   	}

	        } else {
	          console.log(err);
	          res.status(404);
	        }
		});
	},

	getSalary: function (req, res) {
		User.findOne({id:req.session.passport.user}).exec(function findOneUserCB(err, user){

	});
	},

	testGetUserById: function (req, res) {
		CentralDatabaseService.getUserById(1, function(error, response) {
			res.view('testGetUserById', {
		    userInfo: response,
				error: error
			});
		});
	},

	testGetUserByEmail: function (req, res) {
		CentralDatabaseService.getUserByEmail('brian@team2.com', function(error, response) {
			res.view('testGetUserByEmail', {
		    userInfo: response,
				error: error
			});
		});
	}
};

