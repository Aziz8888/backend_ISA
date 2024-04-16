import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import connectToDatabase from './database.js'; // Chemin vers votre fichier de connexion à la base de données
import studentsRoutes from './routes/student.js';
import performancesRoutes from './routes/performance.js'
import bodyParser from 'body-parser';
import questionRoutes from './routes/Question.js';
import testRoutes from './routes/test.js';

// Appel de la fonction pour se connecter à la base de données
import cors from 'cors';
import { errorHandler, notFoundError } from './middlewares/error-hundler.js';
const port = process.env.PORT
connectToDatabase();

// Initialisation de l'application Express
const app = express();
mongoose.set('debug',true);

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"))
// Définition des routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/students',studentsRoutes);
//performance
app.use('/api/performances',performancesRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/test', testRoutes);



app.use(notFoundError);
app.use(errorHandler);
// Démarre le serveur sur le port spécifié dans le fichier .env ou le port 5000 par défaut
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



