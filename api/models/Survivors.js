var Survivors = {
	attributes: {
		name: {
			type: 'STRING',
			defaultsTo: '',
		},
		location: {
			type: 'STRING',
			defaultsTo: '',
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