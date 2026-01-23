const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userControllers');
const auth = require('../auth');

const { verify, verifyActive } = auth;

//check email duplicates
router.post('/checkEmail', (req, res) => {
	UserController.checkEmail(req.body).then(result => res.send(result));
})


//registration
router.post('/register', (req, res) => {
	UserController.register(req.body).then(result => res.send(result));
})

//login
router.post('/login', (req, res) => {
	UserController.loginUser(req.body).then(result => res.send(result));
})


//get credentials of authenticated user
router.get('/details', verify, (req, res) => {
	UserController.getDetails(req.user.id).then(result => res.send(result));
})





// Records ============================================


router.post('/addRecord', verify, verifyActive, (req, res) => {

	UserController.addRecord(req.user.id, req.body).then(result => res.send(result));
})


//get all records of a specific user
router.get('/records', verify, verifyActive, (req, res) => {
	// console.log(req.user.id)
	UserController.getAllRecords(req.user.id).then(result => res.send(result));
})






module.exports = router;