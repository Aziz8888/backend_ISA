import express from 'express';
import connectToDatabase from './database.js'; // Chemin vers votre fichier de connexion à la base de données
import teacherRoutes from './routes/Teacher.js';
import userRoutes from './routes/user.js';
import compilateur from './routes/compilateur.js';
import { notFoundError,errorHandler } from './middlewares/error-handler.js';
import path from 'path';
import questionRoutes from './routes/Question.js';
import performancesRoutes from './routes/performance.js';
import studentsRoutes from './routes/student.js';
import testRoutes from './routes/test.js';
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
app.use('/api/students',studentsRoutes);
app.use('/api/performances',performancesRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user/email', userRoutes);
app.use('/Question', questionRoutes);
app.use('/test', testRoutes);
app.use('/compilateur', compilateur);
app.use(notFoundError);
app.use(errorHandler);

// Démarre le serveur sur le port spécifié dans le fichier .env ou le port 5000 par défaut
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
