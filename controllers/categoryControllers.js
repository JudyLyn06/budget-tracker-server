const Category= require('../models/Category');



//add category and user id
module.exports.addCategory = (id, data) => {


	return Category.findById(id).then( category => {
		let newCategory = new Category({
			categoryName: data.categoryName,
			categoryType: data.categoryType,
			description: data.description,
			userId: id
		})

		return newCategory.save().then((saved, error) => {
			if(error){
				return false;
			} else {
				return true;
			}
		}).catch(error => error)


	})
}

//retrieve authenticated user's categories
module.exports.getAllUsersCategories = (id) => {


	return Category.find({}).then((categories, err) => {
		
		let filteredCategories = categories.filter(function(category){
			return (id === category.userId);
		})

		// console.log(filteredCategories)

		return filteredCategories;

	})
}



//retrieve authenticated user's categories type
module.exports.getAllUsersCategoriesType = (id, data) => {

	// console.log(data);

	return Category.find({ userId: id, categoryType: data.categoryType, isAdmin: true }).then((categories, err) => {
		
		if(err){
			return false;
		} else{
			return categories;
		}

	}).catch(error => error);
}




// module.exports.getAllCategoriesType = () => {

// 	// console.log(id);

// 	return Category.find({ isDefault: true }).then((categories, err) => {
		
// 		if(err){
// 			return false;
// 		} else{
// 			return categories;
// 		}

// 	}).catch(error => error);
// }



//retrieve authenticated user's categories expense
// module.exports.getAllUsersCategoriesExpense = (id) => {


// 	return Category.find({}).then((categories, err) => {
		
// 		let filteredCategoriesExpense = categories.filter(function(category){
// 			return (id === category.userId && category.categoryType === "Expense");
// 		})

// 		// console.log(filteredCategories)

// 		return filteredCategoriesExpense;

// 	})
// }

