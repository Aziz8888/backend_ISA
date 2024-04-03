import express from 'express';
import connectToDatabase from './database.js'; // Chemin vers votre fichier de connexion à la base de données
import teacherRoutes from './routes/Teacher.js';
import userRoutes from './routes/user.js';
import compilateur from './routes/compilateur.js';
import { notFoundError,errorHandler } from './middlewares/error-handler.js';
import path from 'path';
import bodyParser from 'body-parser';
// Appel de la fonction pour se connecter à la base de données
import cors from 'cors';
const port = process.env.PORT
connectToDatabase();

// Initialisation de l'application Express
const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Définition des routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/teachers', teacherRoutes);
app.use('/api/user', userRoutes);
app.use('/compilateur', compilateur);
app.use(notFoundError);
app.use(errorHandler);

// Démarre le serveur sur le port spécifié dans le fichier .env ou le port 5000 par défaut
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
