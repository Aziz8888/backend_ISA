import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import compilateur from './routes/compilateur.js';
import CoursR from './routes/CoursR.js';

const app = express();
const hostname = '127.0.0.1';
const port = process.env.PORT || 9090;
const databaseName = 'PIIM'

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
//app.use('/img', express.static('public'));

app.use((req,res,next)=>{
    console.log("Middleware just ran !");
    next();
});

app.use('/gse', (req,res,next)=> {
    console.log("Middleware just ran on a gse route !")
    next();
});

app.use(cors());
app.use(bodyParser.json());
app.use('/compilateur', compilateur);
app.use('/cours',CoursR)

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
