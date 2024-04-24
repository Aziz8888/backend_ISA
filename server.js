import express from 'express';
import connectToDatabase from './database.js'; // Chemin vers votre fichier de connexion à la base de données
import teacherRoutes from './routes/Teacher.js';
import userRoutes from './routes/user.js';
import compilateur from "./routes/compilateur.js";
import testblanc from "./routes/testblanc.js";
import noteRoutes from './routes/note.js';
import CoursR from './routes/CoursR.js';
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
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


// Définition des routes
app.get('/', (_req, res) => {
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
app.use((req, _res, next) => {
  console.log("Received headers:", req.headers);
  console.log("Received body:", req.body);
  next();
});
app.get('/api/user/getUserDetailsByEmail/:email', (req, _res) => {
  console.log("Received email: ", req.params.email); // Check the email received by the server
  console.log("Request headers: ", req.headers); // Check headers
  // existing code...
});
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
app.use('/cours',CoursR)
app.use('/note', noteRoutes);
app.use('/api/students',studentsRoutes);
app.use('/api/performances',performancesRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user/getUserDetailsByEmail', userRoutes);
app.use('/Question', questionRoutes);
app.use('/test', testRoutes);
app.use("/testblanc", testblanc);
app.use('/compilateur', compilateur);
app.use(notFoundError);
app.use(errorHandler);

// Démarre le serveur sur le port spécifié dans le fichier .env ou le port 5000 par défaut
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
