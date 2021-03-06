var request = require('request');

var apiRoot = 'http://vm344e.se.rit.edu/api/';

function callApi(method, relPath, action, parameters, callback) {
    var options = {
        method: method,
        baseUrl: apiRoot,
        url: relPath,
        qs: {
            action: action
        }
    };

    for (var paramName in parameters) {
        options.qs[paramName] = parameters[paramName];
    }

    // console.log(options.qs);

    request(options, function(error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            try {
                var parsed = JSON.parse(body)
                
            } catch(e) {
                callback(e, null);
            }
            callback(null, parsed);
        }
    });
}

module.exports = {

    getAllUsers: function(callback) {
        callApi('GET', 'User.php', 'get_all_users', { }, callback)
    },

    getUserById: function(id, callback) {
        callApi('GET', 'User.php', 'get_user_by_id', { id: id }, callback);
    },

    getUserByEmail: function(email, callback) {
        callApi('GET', 'User.php', 'get_user_by_email', { email: email }, callback );
    },

    getUserByGoogleId: function(googleid, callback) {
        callApi('GET', 'User.php', 'get_user_by_googleid', { googleid: googleid }, callback );
    },

    createUser: function(email, type, firstname, lastname, authtoken, googleid, callback) {
        callApi('POST', 'User.php', 'create_user', { email: email, type: type, firstname: firstname, lastname: lastname, authtoken: authtoken, googleid: googleid }, callback);
    },

    updateUser: function(id, optionalParams, callback) {
        var params = { id: id };
        for (var paramName in optionalParams) {
            params[paramName] = optionalParams[paramName];
        }

        callApi('POST', 'User.php', 'update_user', params, callback);
    },

    setUserInactive: function(id, callback) {
        var params = { id: id };

        callApi('POST', 'User.php', 'set_user_inactive', params, callback);
    }
}