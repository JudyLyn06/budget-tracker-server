const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'First Name is required']
	},
	lastName: {
		type: String,
		required: [true, 'Last Name is required']
	},
	email: {
		type: String,
		required: [true, 'Email is required']
	},
	password: {
		type: String,
		//not required because of google login
	},
	loginType:{
		type: String,
		required: [true, 'Login is required']
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	isActive: {
		type: Boolean,
		default: true
	},
	budget: {
		type: Number,
		required: [true, 'Balance for transaction is required']
	},
	records : [{
			recordName: {
				type: String,
				required: [true, 'Record name is required (Transaction)']
			},
			categoryType: {
				type: String,
				required: [true, 'Category is required']
			},
			amount: {
				type: Number,
				required: [true, 'amount is required']
			},
			description: {
				type: String,
				default: null
			},		
			isActive: {
				type: Boolean,
				default: true
			},
			createdOn: {
				type: Date,
				default: new Date()
			},
			currentBalance: {
				type: Number,
				required: [true, "Current balance is required"]
			}
	}]
})

module.exports = mongoose.model('user', userSchema)