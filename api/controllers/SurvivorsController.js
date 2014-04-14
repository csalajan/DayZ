var SurvivorsController = {
	create: function(req, res) {
		Survivors.create({userId: req.session.user.id}).done(function(err, survivor) {
			res.redirect('profile');
		});
	}

}

module.exports = SurvivorsController;