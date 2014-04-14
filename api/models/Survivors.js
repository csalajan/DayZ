var Survivors = {
	attributes: {
		name: {
			type: 'STRING',
		},
		location: {
			type: 'STRING',
		},
		blood: {
			type: 'STRING',
		},
		dead: {
			type: 'BOOLEAN',
			defaultsTo: false,
		},
		userId: {
			required: true,
			type: 'STRING',
		},

		toJSON: function() {
			var obj = this.toObject();

			return obj;
		}

	}

}

module.exports = Survivors;