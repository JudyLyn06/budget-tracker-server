const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const port = 4000;

const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');



//server
const app = express();



mongoose.connect('mongodb+srv://dbUser:dbUser@zuitt.ri5rh.mongodb.net/budgetTracker?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});


let db = mongoose.connection;

db.on('error', () => {
	console.log('Something went wrong with our MongoDB connection')
});

db.once('open', () => {
	console.log('Now connected to cloud database')
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// Routes
app.use('/users', userRoutes);
app.use('/categories',categoryRoutes);





app.listen(port, ()=> {
	console.log(`API is now online on port ${port}`)
})