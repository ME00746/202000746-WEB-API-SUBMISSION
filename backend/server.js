const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Route imports
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewsRoutes = require('./routes/reviewRoutes');

app.use(cors());
app.use(express.json());

// Swagger Definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe Discovery API',
      version: '1.0.0',
      description: 'A Web API for discovering recipes based on ingredients, cuisine, and cooking methods.',
      contact: {
        name: 'Mohamed Reda',
        email: 'ME00746@tkh.edu.eg'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database URI
dbURI = 'mongodb+srv://me00746:aAN43UD04tyj1a50@cluster0.x3ffvoh.mongodb.net/';


// API Routes
app.use('/api', recipeRoutes);
app.use('/api', reviewsRoutes);
app.use('/api', userRoutes);

// Connect to MongoDB and start the server
mongoose.connect(dbURI)
  .then((result) => app.listen(5000, () => {
            console.log(`Server running on port 5000`);
          }))
  .catch((err) => console.log(err));
