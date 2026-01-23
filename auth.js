const jwt = require('jsonwebtoken');
const secret = 'BudgetTrackerJudy';


module.exports.createAccessToken = (user) => {

	const data = {
		id: user._id,
		email: user.email,
		isActive: user.isActive,
		budget: user.budget
	}

	return jwt.sign(data, secret, {})

}



module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	// console.log(token)

	if(typeof token === 'undefined'){
		return res.send({ auth: "no token"})
	} else {
		token = token.slice(7, token.length)

		jwt.verify(token, secret, function(err, decodedToken) {

			if(err){
				return res.send({
					auth: "failed something went wrong",
					error: err
				})
			}else {
				req.user = decodedToken;

				next();
			}

		})
	}
}



//verify if the user is active
module.exports.verifyActive = (req, res, next) => {
	if(req.user.isActive) {
		next();
	} else {
		return res.send({
			auth: 'failed',
			message: 'the user is no longer active'
		})
	}
}



//verify if an admin
module.exports.verifyAdmin = (req, res, next) =>{
	if(req.user.isAdmin){
		next();
	}else {
		return res.send({
			message: "admin"
		})

		next();
	}
}




