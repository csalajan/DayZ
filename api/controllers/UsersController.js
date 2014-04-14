var UsersController = {
	create: function(req, res) {
		var username = req.param('username');
		var password = req.param('password');
		var email = req.param('email');

		Users.findByUsername(username).done(function(err, usr) {
			if (err) {
				res.send(500, {error: "Database Error"});
			} else if (!usr) {
				res.send(400, {error: 'Username is already taken'});
			} else {
				var crypto = require('crypto');
				var salt = crypto.randomBytes(128).toString('base64');
				var hash = crypto.createHash('sha512');
				hash.update(password);
				hash.update(salt);
				password = hash.digest('base64');

				Users.create({username: username, password: password, emailAddress: email, salt: salt}).done(function(err, user) {
					if (err) {
						res.send(400, {error: err});
					} else {
						
						req.session.user = user;

						user.online = true;
						user.save(function(err, user) {
							Users.publishCreate({
								id: user.id,
					   			username: user.username,
					   			firstName: user.firstName,
					   			lastName: user.lastName,
					   			emailAddress: user.emailAddress,
					   			online: user.online
				   			});
		    				res.json(user);
						});
					}
				})
			}
		})
    },
    edit: function(req, res) {
    	Users.findOneById(req.param('id')).done(function(err, user) {
    		if (err) {
    			res.send(400, {error: err});
    		} else {
    			user.firstName = req.param('firstName');
    			user.lastName = req.param('lastName');

    			user.save(function(err, user) {
    				if (err) {
    					res.send(400, {error: err});
    				} else {
    					res.json(200, {action: 'Updated Profile', user: user});
    				}
    			});
    		}
    	});
    },
    login : function(req, res) {
    	var username = req.param('username');
    	var password = req.param('password');

    	Users.findOneByUsername(username).done(function(err, usr)  {
    		if (err) {
    			res.json(500, {error: error});
    		} else if (!usr) {
    			//res.json(200, {error: 'Invalid Username / Password Combination'});
    			res.view('home/index', {message: 'Invalid Username / Password Combination'});
    		} else {

	   			if (password) {
	    			var crypto = require('crypto');
	    			var hash = crypto.createHash('sha512');
	    			hash.update(password);
	    			hash.update(usr.salt);
	    			password = hash.digest('base64');

	    			if (password === usr.password) {

	    				req.session.user = usr;
	    				req.session.authenticated = true;

	    				usr.online = true;
	    				usr.save(function(err, user) {
	    					Users.publishUpdate(user.id, {
		    					online: true,
		    					id:  user.id,
		    					username: user.username

		    				});
		    				//res.json(200, {action: 'login', user: user});
		    				res.view('home/index');
	    				});
	    				
	    			} else {
	    				//res.json(401, {error: 'Invalid Username / Password Combination'});
	    				res.view('home/index', {message: 'Invalid Username / Password Combination'});
	    			}
	    		} else {
	    			//res.json(401, {error: 'Invalid Username / Password Combination'});
	    			res.view('home/index', {message: 'Invalid Username / Password Combination'});
	    		}
						
    		}
    	});
    },
    logout: function(req, res) {
    	if (req.session.user) {
	    	Users.findOneById(req.session.user.id).done(function(err, user) {
	    		if (err) return next(err);
	    		req.session.authenticated = false;
	    		user.online = false;
	    		user.save(function(err, user) {
	    			Users.publishUpdate(user.id, {
	    				online: false,
	    				id:  user.id,
						username: user.username
	    			});

	    			req.session.user = null;
	    			res.view('home/index');
	    		});
	    	});
    	} else {
	    		res.view('home/index');
	    	}
    },
    profile: function(req, res) {
    	Users.findOneById(req.session.user.id).done(function(err, user) {
    		if (err) {
    			res.send(401, {error: err});
    		} else {
    			res.view('home/user/profile', {user: user});
    		}
    	});
    },
    update: function(req, res) {
    	Users.findOneById(req.param('id')).done(function(err, user) {
    		if (err) {
    			res.send(401, {error: err});
    		} else {
    			var data = req.params.all();
    			delete data.id;
    			Users.update(req.param('id'), data, function(err) {
    				if (err) {
    					res.send(401, {error: err});
    				} else {
    					res.json(200, {action: 'User Updated'});
    				}
    			})
    		}
    	})
    },
    destroy: function(req, res) {
    	Users.findOne({id: req.param('id')}).done(function(err, user) {
    		if (err) {
    			res.send(401, {error: err});
    		} else {
    			Users.destroy(req.param('id'), function(err) {
    				if (err) {
    					res.send(401, {error: err});
    				} else {
    					Users.publishDestroy(req.param('id'))
    					res.json(200, {action: 'User Deleted'});
    				}
    			})
    		}
    	})
    },
	subscribe: function(req, res) {
		Users.find(function foundUsers(err, users) {
			if (err) return next(err);
			Users.subscribe(req.socket);

			Users.subscribe(req.socket, users);

			res.send(200);
		});
	}
};

module.exports = UsersController;