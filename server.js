const express=require('express')
const dotenv= require('dotenv')
const morgan=require('morgan')
const {connectDB}=require('./config/db');
const authRoute=require('./routes/authRoute')
const {notFound,errorHandler}=require('./middleware/errorMiddleware') 

const app=express();

dotenv.config()
connectDB();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/auth',authRoute)
app.get('/', async (req,res)=>{
  res.send('hello')
})

app.use(notFound)
app.use(errorHandler)

const port=process.env.PORT || 5000;

app.listen(port,console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`)) 