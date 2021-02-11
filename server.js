const express=require('express')
const dotenv= require('dotenv')
const morgan=require('morgan')
const {connectDB}=require('./config/db');

const {notFound,errorHandler}=require('./middleware/errorMiddleware') 

const app=express();

dotenv.config()
connectDB();

app.get('/', async (req,res)=>{
  res.send('hello')
})

app.use(notFound)
app.use(errorHandler)

const port=process.env.PORT || 5000;

app.listen(port,console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`)) 