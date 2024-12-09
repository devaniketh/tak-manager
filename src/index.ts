import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';


import userRoutes from './routes/user'; 

dotenv.config(); 
const app = express();


app.use(cors()); 
app.use(bodyParser.json());

app.use('/api/users', userRoutes); 

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
