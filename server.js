import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import { notFoundError,errorHandler } from './middleware/error-handler.js';


const app = express()
const hostname = "127.0.0.1";
const port = process.env.PORT  || 9091;
const databaseName = 'AI Student Analytics '

mongoose.set('debug', true);
mongoose.Promise = global.Promise
mongoose
mongoose
.connect(`mongodb://${hostname}:27017/${databaseName}`)
.then (() => {
    console.log(`Connected to ${databaseName}`)
})
.catch(err =>{
    console.log(err)
});
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/img', express.static('public\ images'));

app.use((req,res,next)=>{
    console.log("Middleware just ran !");
    next();
});

app.use('/gse', (req,res,next)=> {
    console.log("Middleware just ran on a gse route !")
    next();
});

app.use(notFoundError);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})