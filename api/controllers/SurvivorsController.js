var SurvivorsController = {
	create: function(req, res) {
		Survivors.create({userId: req.session.user.id}).done(function(err, survivor) {
			res.redirect('profile');
		});
	},
	update: function(req, res) {
		Survivors.findOne().where({userId: req.session.user.id}).where({dead: false}).done(function(err, survivor) {
			if (err) {
				req.json(400, {error: err});
			} else {
				survivor.update(req.param.all()).done(function(err, survivor) {
					res.redirect('profile');
				});
			}
		});
	},
	dead: function(req, res) {
		Survivors.findOne().where({userId: req.session.user.id}).where({dead: false}).done(function(err, survivor) {
			survivor.dead = true;
			survivor.save(function(err, survivor) {
				res.redirect('profile');
			});
		}
	}

}

module.exports = SurvivorsController;