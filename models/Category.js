const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({

	categoryName:{
		type: String,
		required: [true, 'Category name is required']
	},
	categoryType: {
		type: String,
		required: [true, 'Category Type is required']
	},
	description:{
		type: String
	},
	isActive: {
		type: Boolean,
		default: true
	},
	isDefault: {
		type: Boolean,
		default: false
	},
	userId: {
		type: String
	}

})

module.exports = mongoose.model('Category', categorySchema)