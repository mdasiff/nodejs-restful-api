import express from 'express';
import bodyParser from 'body-parser';
import privateApiRoutes from './app/routes/api.js';
import frontApiRoutes from './app/routes/front-api.js';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

import connectDB from './app/database/connect.js';
await connectDB();
const app = express();

//console.log("decodedToken", decodedToken)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Define a list of allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];

// Configure CORS with options
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the list of allowed origins or if it's undefined (e.g., for same-origin requests)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
};

app.use(cors(corsOptions));

// Function to serve all static files
// inside public directory.
app.use(express.static('public'));
app.use('/public', express.static('public'));

// Define a simple route
// app.get('/', (req, res) => {
//   res.send('Hello, World12');
// });

// app.get('/api1', (req, res) => {
//   res.send('Hello, World!!! api3');
// });

app.use('/web-api', frontApiRoutes);
app.use('/api', privateApiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});