const express = require('express');
const router = express.Router();

const CategoryController = require('../controllers/categoryControllers');
const auth = require('../auth');

const { verify, verifyActive, verifyAdmin } = auth;

router.post('/addCategory', verify, verifyActive, (req, res) => {
	CategoryController.addCategory(req.user.id, req.body).then(result => res.send(result));
})



//get all categories of a specific user
router.get('/usersCategories', verify, verifyActive, (req, res) => {
	CategoryController.getAllUsersCategories(req.user.id).then(result => res.send(result));
})


//get all categories of a specific user' income
router.post('/usersCategories/type', verify, verifyActive, (req, res) => {
	CategoryController.getAllUsersCategoriesType(req.user.id, req.body).then(result => res.send(result));
})


// router.get('/usersCategories/allType', (req, res) => {
// 	CategoryController.getAllCategoriesType().then(result => res.send(result));
// })

//get all categories of a specific user' expense
// router.get('/usersCategories/expense', verify, verifyActive, (req, res) => {
// 	CategoryController.getAllUsersCategoriesExpense(req.user.id).then(result => res.send(result));
// })

//delete
// router.delete('/:id/delete', )

module.exports = router;