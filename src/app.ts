import 'express-async-errors'
import express from 'express';
//routes
import authRouter from './routes/authRoute';
import userRouter from './routes/userRoute'
//error handler
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';
//pages
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;

// pages
app.use(morgan('tiny'));
// this is the sine
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(cors());

// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.get('/api/v1',(req,res)=>{
  console.log(req.signedCookies)
  res.send('home route')
})

// middle wares
app.use(notFound)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
