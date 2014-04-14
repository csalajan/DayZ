var EventsController = {
	display: function(req, res) {
		Survivors.findOne().where({userId: req.session.user.id}).where({dead: false}).done(function(err, survivor) {
			Events.find().where({survivorId: survivor.id}).done(function(err, events) {
				res.view('home/user/events', {events: events, survivor: survivor});
			});
		});
	},
	create: function(req, res) {
		Survivors.findOne().where({userId: req.session.user.id}).where({dead: false}).done(function(err, survivor) {
			var params = req.params.all();
			params.survivorId = survivor.id;
			Events.create(params, function(err, event) {
				res.redirect('events');
			});
		});
	},

}

module.exports = EventsController;