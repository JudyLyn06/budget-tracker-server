const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

//Google Login
// Google Login
module.exports.googleLogin = async (data) => {
  try {
    const token = data.token; // from React: { token: idToken }

    if (!token) {
      return { error: 'Google token is required' };
    }

    // 1) Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return { error: 'Invalid Google token' };
    }

    // 2) Guardrails
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
    if (!validIssuers.includes(payload.iss)) {
      return { error: 'Invalid token issuer' };
    }

    if (!payload.email || payload.email_verified !== true) {
      return { error: 'Google email is not verified' };
    }

    const email = payload.email.toLowerCase();
    const firstName = payload.given_name || '';
    const lastName = payload.family_name || '';

    // 3) Find user
    let user = await User.findOne({ email });

    // 4) Create if not exist
    if (!user) {
      user = new User({
        firstName,
        lastName,
        email,
        // IMPORTANT: password is required in your schema because register() sets it.
        // If your Mongoose schema requires password, you must provide something.
        // Better: make password optional for google users.
        password: bcrypt.hashSync(String(payload.sub), 10),
        loginType: 'google',
        budget: 0,
        isActive: true
      });

      await user.save();
    } else {
      // If user exists but was created by email/password, keep it.
      // Optionally, update loginType to 'google' OR keep 'email' (your choice).
      if (!user.loginType) user.loginType = 'google';
      await user.save();
    }

    // 5) Issue your app token (same structure as email/password login)
    return { accessToken: auth.createAccessToken(user.toObject()) };

  } catch (error) {
    console.error('googleLogin error:', error);
    return { error: 'Google login failed' };
  }
};

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











