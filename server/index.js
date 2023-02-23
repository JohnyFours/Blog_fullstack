import express from "express";
import mongoose from "mongoose";
import dotevn from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth.js'

const app = express();
dotevn.config();

// DB constant

const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

app.use(cors());

app.use(express.json())

//Routers 

app.use('/api/auth', authRoute)



async function start() {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.yfbfg2k.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)

        app.listen(PORT, () => console.log(`server started on port: ${PORT}`));
    } catch (error) {
        console.log(error)
    }
}

start()