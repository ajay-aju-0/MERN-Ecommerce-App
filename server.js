// const express = require('express');
import express from "express"
import dotenv from "dotenv"
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors'
import path from 'path'

// configure environment
dotenv.config();

// database configuration
connectDB();

// rest object
const app = express();


//middlewares
app.use(cors());
app.use(express.json({limit : 52428800,extended: true}));
app.use(express.urlencoded({limit : '50mb',extended : true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'./client/build')))

// routes
app.use(`/api/v1/auth`,authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);

app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
})


const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})