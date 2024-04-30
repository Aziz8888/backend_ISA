import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import compilateur from './routes/compilateur.js';
import CoursR from './routes/CoursR.js';
import testblanc from './routes/testblanc.js'
import detectionerr from './routes/detectionerr.js'

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

app.use(bodyParser.json());
app.use('/compilateur', compilateur);
app.use('/cours',CoursR)
app.use("/testblanc", testblanc);
app.use("/detectionerr", detectionerr);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
/*

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const app = express();
const hostname = '127.0.0.1';
const port = process.env.PORT || 9090;
const databaseName = 'PIIM';

const ai = new GoogleGenerativeAI("AIzaSyCb__QQxCrc15mbnhjGDxJOeDMF5K_2NAo");
//const model = ai.getGenerativeModel({ model: "gemini-pro" });

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${hostname}:27017/${databaseName}`)
    .then(() => {
        console.log(`Connected to ${databaseName}`);
    })
    .catch(err => {
        console.log(err);
    });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log("Middleware just ran !");
    next();
});

app.use('/gse', (req, res, next) => {
    console.log("Middleware just ran on a gse route !");
    next();
});

app.use(bodyParser.json());

app.post('/poserQuestion', async (req, res) => {
    try {
        const { question, reponse_attendue, mots_cles, note_totale } = req.body;

        if (!question || !mots_cles || !note_totale) {
            return res.status(400).json({ error: "Paramètres manquants." });
        }

        // Appel à Gemini pour obtenir la réponse générée
        const model = ai.getGenerativeModel({ model: "gemini-pro" });
        const reponse_generee = (await model.generateContent(question)).text;

        // Vérifier si la réponse attendue est définie
        let reponse_attendue_parts = [];
        if (reponse_attendue && typeof reponse_attendue === 'string') {
            reponse_attendue_parts = reponse_attendue.toLowerCase().split(' ');
        }
        
        // Séparation des parties de la réponse générée et des mots-clés en mots
        const reponse_generee_parts = reponse_generee.toLowerCase().split(' ');
        const mots_cles_parts = mots_cles.map(mot => mot.trim().toLowerCase());

        let note_obtenue = 0;
        let partie_correcte = [];

        // Comparer les mots entre la réponse générée et la réponse attendue pour trouver la partie correcte
        for (let i = 0; i < reponse_generee_parts.length && partie_correcte.length < reponse_attendue_parts.length; i++) {
            if (reponse_attendue_parts.includes(reponse_generee_parts[i])) {
                partie_correcte.push(reponse_generee_parts[i]);
            }
        }

        // Calculer la note obtenue basée sur les mots-clés présents dans la partie correcte
        for (const mot_cle of mots_cles_parts) {
            if (partie_correcte.includes(mot_cle)) {
                note_obtenue += note_totale / mots_cles_parts.length;
            }
        }

        console.log(`La partie correcte de la réponse générée par Gemini est : ${partie_correcte.join(' ')}`);

        // Renvoyer la note obtenue
        res.json({ note_obtenue: note_obtenue.toFixed(2) });
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: "Une erreur s'est produite lors du traitement de la requête." });
    }
});





app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/
/*
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const app = express();
const hostname = '127.0.0.1';
const port = process.env.PORT || 9090;
const databaseName = 'PIIM';

const ai = new GoogleGenerativeAI("AIzaSyCb__QQxCrc15mbnhjGDxJOeDMF5K_2NAo");
const model = ai.getGenerativeModel({ model: "gemini-pro" });

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${hostname}:27017/${databaseName}`)
    .then(() => {
        console.log(`Connected to ${databaseName}`);
    })
    .catch(err => {
        console.log(err);
    });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log("Middleware just ran !");
    next();
});

app.use('/gse', (req, res, next) => {
    console.log("Middleware just ran on a gse route !");
    next();
});

app.use(bodyParser.json());
async function poser_question(req, res) {
    rl.question("Entrez votre question : ", async function(question) {
        rl.question("Entrez la réponse attendue : ", async function(reponse_attendue) {
            rl.question("Entrez les mots-clés (séparés par des virgules) : ", async function(mots_cles) {
                rl.question("Entrez la note totale : ", async function(note_totale) {
                    try {
                        const reponse_generee = await model.generateContent(question);
                        
                        if (!reponse_generee || !reponse_generee.text) {
                            console.log("Réponse générée est undefined ou vide");
                            return res.status(500).json({ message: "Réponse générée est undefined ou vide." });
                        }

                        let reponse_attendue_parts = reponse_attendue.toLowerCase().split(' ');
                        let reponse_generee_parts = reponse_generee.text.toLowerCase().split(' ');

                        console.log("Réponse générée (parts) :", reponse_generee_parts);
                        console.log("Réponse attendue (parts) :", reponse_attendue_parts);

                        let partie_correcte = [];
                        let i = 0;
                        for (let word of reponse_generee_parts) {
                            if (i < reponse_attendue_parts.length && reponse_attendue.toLowerCase().includes(word)) {
                                partie_correcte.push(word);
                                i++;
                            }
                        }

                        console.log("Partie correcte :", partie_correcte);

                        let note_obtenue = 0;
                        mots_cles.split(',').forEach(mot_cle => {
                            if (partie_correcte.includes(mot_cle.trim().toLowerCase())) {
                                note_obtenue += note_totale / mots_cles.split(',').length;
                            }
                        });

                        if (partie_correcte.length > 0) {
                            res.status(200).json({
                                partie_correcte: partie_correcte.join(' '),
                                note_obtenue: note_obtenue.toFixed(2)
                            });
                        } else {
                            res.status(400).json({ message: "La réponse est incorrecte." });
                        }
                    } catch (error) {
                        console.error("Erreur lors de la génération de la réponse:", error);
                        res.status(500).json({ message: "Erreur lors de la génération de la réponse." });
                    }
                });
            });
        });
    });
}




app.post('/poser-question', poser_question);

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/
