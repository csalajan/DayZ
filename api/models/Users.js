/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var Users = {
	attributes: {
		username: {
			required: true,
			type: 'STRING',
		},
		password: {
			required: true,
			type: 'TEXT',
		},
		salt: 'STRING',
		
		charName: {
			type: 'STRING',
			defaultsTo: '',
		},
		emailAddress: {
			required: true,
			type: 'EMAIL',
		},
		online: {
			type: 'BOOLEAN',
			defaultsTo: false
		},
		admin: {
			type: 'BOOLEAN',
			defaultsTo: false
		},
		reset: {
			type: 'STRING',
			defaultsTo: '0'
		},
		blood: {
			type: 'STRING',
		},
		location: {
			type: 'STRING',
		},

		toJSON: function() {
	        var obj = this.toObject();
	        
	        return obj;
	   },
	   toObject: function() {
	   		var obj = this;
	        delete obj.password;
	        delete obj.salt;
	        delete obj.reset;
	        return obj;
	   }
	}
}
module.exports = Users; 