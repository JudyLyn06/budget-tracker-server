const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require("dotenv").config();

const port = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI. Check your .env file.");
}


const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');



//server
const app = express();



mongoose.connect(MONGODB_URI, {
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