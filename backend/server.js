const express = require('express');
const app = express();
const mongoose = require('mongoose');

const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewsRoutes = require('./routes/reviewRoutes');
const cors = require('cors');


app.use(cors());
app.use(express.json());

dbURI = 'mongodb+srv://me00746:aAN43UD04tyj1a50@cluster0.x3ffvoh.mongodb.net/'

app.use('/api', recipeRoutes);
app.use('/api', reviewsRoutes);
app.use('/api', userRoutes);

mongoose.connect(dbURI)
  .then((result) => app.listen(5000, () => {
            console.log(`Server running at 5000`);}) )
  .catch((err) => console.log(err));


