import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import compilateur from "./routes/compilateur.js";
import testblanc from "./routes/testblanc.js";
import CoursR from "./routes/CoursR.js";
import connectToDatabase from './database.js'; // Chemin vers votre fichier de connexion à la base de données

import noteRoutes from './routes/note.js'

import testRoutes from './routes/test.js';
import { notFoundError,errorHandler } from './middlewares/error-handler.js';
import path from 'path';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

connectToDatabase();
const app = express();
const hostname = "127.0.0.1";
const port = process.env.PORT || 9090;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
mongoose.set('debug', true);
mongoose.Promise = global.Promise;
//const databaseName = "PIIM";

/*ongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose;
mongoose
  .connect(`mongodb://${hostname}:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });
*/
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log("Middleware just ran !");
  next();
});

app.get('/upload/:folder/:filename',(req,res)=> {
  const {filename , folder} = req.params;
 
  const iamgePath = (path.join(__dirname, 'uploads', folder , filename));
  fs.access(iamgePath , fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('File not found')
      console.log(iamgePath)
    } else {
      res.sendFile(iamgePath)
    }
  })
})
app.use("/gse", (req, res, next) => {
  console.log("Middleware just ran on a gse route !");
  next();
});
app.use("/compilateur", compilateur);
app.use("/testblanc", testblanc);
//route karim
app.use("/cours", CoursR);

app.use('/note', noteRoutes);
//karim


//app.use('/Question', questionRoutes);
app.use('/test', testRoutes);
app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
