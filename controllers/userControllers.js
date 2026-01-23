const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth');


//check email duplicates
module.exports.checkEmail = (data) => {
	return User.find({ email: data.email }).then(result => {
		if(result.length > 0){
			return true;
		} else{
			return false;
		}
	})
}



// Register
module.exports.register = (data) => {

	const user = new User({
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		password: bcrypt.hashSync(data.password, 10),
		loginType: 'email',
		budget: data.budget
	})


	return user.save().then((user, err) => {
		if(err) {
			return false;
		}else {
			return true;
		}
	}).catch(error => error)

}


//login

module.exports.loginUser = (data) => {

	return User.findOne({ email: data.email }).then(result => {
		if(result == null) {
			return { error: 'no email found'}
		} else {
			const isPasswordMatch = bcrypt.compareSync(data.password, result.password)


			if(isPasswordMatch) {
				return { accessToken: auth.createAccessToken(result.toObject()) }
			}else {
				return false;
			}
		}
	})

}

//get user's details
module.exports.getDetails = (user) => {
	return User.findById(user, { password: 0 }).then(result => {
		return result;
	})
}	



// Records ================================


//add records and user id
module.exports.addRecord = (id, params) => {

	return User.findById(id).then( data => {

		if(params.categoryType === 'Expense'){
			data.budget -= params.amount
		}
		else if(params.categoryType === 'Income'){
			data.budget += params.amount
		}


		let newRecord = {

			recordName: params.recordName,
			categoryType: params.categoryType,
			amount: params.amount,
			description: params.description,
			currentBalance: data.budget
		}

		data.records.push(newRecord)

		return data.save().then((saved, error) => {
			if(error){
				return false;
			} else {
				return true;
			}
		}).catch(error => error)


	}).catch(error => error)
}


//retrieve authenticated user's records
module.exports.getAllRecords = (id) => {
	return User.findById(id).then((user, err) => {
	
		if(err){
			return false;
		}else{
			return user.records;
		}

	}).catch(error => error)
}











