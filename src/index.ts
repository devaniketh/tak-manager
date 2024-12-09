import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';


import userRoutes from './routes/user'; // Assuming you have a 'user.ts' file in the routes directory

dotenv.config(); // Load environment variables from .env file
const app = express();

// Middleware
app.use(cors()); // Enables CORS
app.use(bodyParser.json()); // Parses incoming JSON requests

// Use the user routes
app.use('/api/users', userRoutes); // Assuming the userRoutes handles the user-related API routes

const PORT = process.env.PORT || 5000; // Use the port from .env or default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
