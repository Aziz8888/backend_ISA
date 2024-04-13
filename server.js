import express from 'express';
import connectToDatabase from './database.js'; // Chemin vers votre fichier de connexion à la base de données
import teacherRoutes from './routes/Teacher.js';
import questionRoutes from './routes/Question.js';
import testRoutes from './routes/test.js';
import { notFoundError,errorHandler } from './middlewares/error-handler.js';
import path from 'path';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
connectToDatabase();

// Initialisation de l'application Express
const hostname = '0.0.0.0';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Définition des routes
app.get('/', (req, res) => {
  res.send('Hello World!');
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

app.use('/teachers', teacherRoutes);
app.use('/Question', questionRoutes);
app.use('/test', testRoutes);
app.use(notFoundError);
app.use(errorHandler);

// Démarre le serveur sur le port spécifié dans le fichier .env ou le port 5000 par défaut
const PORT = process.env.PORT || 5000;
const server = app.listen(0,hostname,() => {
  console.log('Server listening on port:', server.address().port);
});
