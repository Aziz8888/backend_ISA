import multer, {diskStorage} from "multer";
import {join, dirname} from "path";
import { fileURLToPath } from "url";

const MIME_TYPES ={
    "image/jpg":"jpg",
    "image/jpeg":"jpg",
    "image/png":"png",
};
/*
export default multer({
    storage : diskStorage({
        destination: (req, fille, callback)=> {
            const __dirname = dirname(fileURLToPath(import.meta.url));
            callback(null, join(__dirname,"../public/images"));
        },
        filename: (req,file, callback) => {
            const name = file.originalname.split(" ").join("_");
            const extension = MIME_TYPES[file.mimetype];
            callback(null,name + DataTransfer.now() + "." + extension);

        },
    }),
    limits:10 * 1024 * 1024,
}).single("image");*/
export default multer({
    // Configuration de stockage
    storage: diskStorage({
      // Configurer l'emplacement de stockage
      destination: (req, file, callback) => {
        const __dirname = dirname(fileURLToPath(import.meta.url)); // Récupérer le chemain du dossier courant
        callback(null, join(__dirname, "../public/images")); // Indiquer l'emplacement de stockage
      },
      // Configurer le nom avec lequel le fichier va etre enregistrer
      filename: (req, file, callback) => {
        // Remplacer les espaces par des underscores
        const name = file.originalname.split(" ").join("_");
        // Récupérer l'extension à utiliser pour le fichier
        const extension = MIME_TYPES[file.mimetype];
        //  Ajouter un timestamp Date.now() au nom de fichier
        callback(null, name + Date.now() + "." + extension);
      },
    }),
    // Taille max des images 10Mo
    limits: 10 * 1024 * 1024,
  }).single("image"); // Le fichier est envoyé dans le body avec nom/clé 'image'
