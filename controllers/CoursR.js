
import cloudinary from '../middlewares/cloudinary.js';
import CoursR from "../models/CoursR.js";
import fs from 'fs';
import path from 'path';

// Ajout de cours
export async function AjouterCoursR(req, res) {
    try {
        const cloudinaryy = await cloudinary.uploader.upload(req.file.path, { resource_type: 'raw' });
    
        await CoursR.create({
            nomCoursR: req.body.nomCoursR,
            description: req.body.description, // Ajout de la description
            pdff: cloudinaryy.secure_url,
        });

        res.status(200).json({ message: 'Cours ajouté avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/*
import cloudinary from '../middleware/cloudinary.js';
import CoursR from "../model/CoursR.js";
import fs from 'fs';
import path from 'path';

// Ajout de cours
export async function AjouterCoursR(req, res) {
    try {
        const cloudinaryy = await cloudinary.uploader.upload(req.file.path, { resource_type: 'raw' });
    
        await CoursR.create({
            nomCoursR: req.body.nomCoursR,
            pdff: cloudinaryy.secure_url,
        });

        res.status(200).json({ message: 'Cours ajouté avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}*/

// Récupération de tous les cours
export async function GetAllCours(req, res) {
    try {
        const cours = await CoursR.find();

        if (!cours || cours.length === 0) {
            return res.status(404).json({ message: 'Aucun cours trouvé' });
        }

        res.status(200).json(cours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
    }
}
// Suppression d'un cours par ID
export async function deleteById(req, res) {
    try {
        const courseId = req.params.id; // Récupérer l'ID du cours depuis les paramètres de la requête

        const cours = await CoursR.findById(courseId);

        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        // Suppression du fichier PDF de Cloudinary
        const publicId = cours.pdff.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        // Suppression du cours de la base de données
        await CoursR.findByIdAndDelete(courseId);

        res.status(200).json({ message: 'Cours supprimé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression du cours' });
    }
}


// Récupération d'un cours par nom
export async function GetCoursR(req, res) {
    try {
        const nomCours = req.params.nomCours;  // Récupérer le nom du cours depuis les paramètres de la requête
        
        const cours = await CoursR.findOne({ nomCoursR: nomCours });

        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        // Vérifiez si le fichier PDF existe
        const pdfPath = cours.pdff;
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ message: 'Fichier PDF non trouvé' });
        }

        // Envoyez le fichier PDF en tant que réponse
        const pdfName = path.basename(pdfPath);
        const pdfStream = fs.createReadStream(pdfPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${pdfName}`);
        
        pdfStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du cours' });
    }
}

/*
import cloudinary from '../middleware/cloudinary.js';
import CoursR from "../model/CoursR.js";

export async function AjouterCoursR(req, res) {
    try {
        // Cloudinary est déjà initialisé dans votre middleware cloudinary.js
        const cloudinaryy = await cloudinary.uploader.upload(req.file.path, { resource_type: 'raw' });
    
        await CoursR.create({
            nomCoursR: req.body.nomCoursR,
            pdff: cloudinaryy.secure_url,
        });

        res.status(200).json({ message: 'Cours ajouté avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Ajoutez cette fonction dans le fichier
export async function GetAllCours(req, res) {
    try {
        const cours = await CoursR.find();

        if (!cours || cours.length === 0) {
            return res.status(404).json({ message: 'Aucun cours trouvé' });
        }

        res.status(200).json(cours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
    }
}

export async function GetCoursR(req, res) {
    try {
        const nomCours = req.params.nomCours;  // Récupérer le nom du cours depuis les paramètres de la requête
        
        const cours = await CoursR.findOne({ nomCoursR: nomCours });

        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        res.status(200).json(cours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du cours' });
    }
}
*/

/*import cloudinary from '../middleware/cloudinary.js';
import CoursR from "../model/CoursR.js";

export async function AjouterCoursR(req, res) {
    try {
        // Cloudinary est déjà initialisé dans votre middleware cloudinary.js
        const cloudinaryy = await cloudinary.uploader.upload(req.file.path, { resource_type: 'raw' });
    
        await CoursR.create({
            nomCoursR: req.body.nomCoursR,
            pdff: cloudinaryy.secure_url,
        });

        res.status(200).json({ message: 'Cours ajouté avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export async function GetAllCours(req, res) {
    try {
        const cours = await CoursR.find();

        if (!cours || cours.length === 0) {
            return res.status(404).json({ message: 'Aucun cours trouvé' });
        }

        res.status(200).json(cours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
    }
}

export async function GetCoursR(req, res) {
    try {
        const nomCours = req.params.nomCours;  // Récupérer le nom du cours depuis les paramètres de la requête
        
        const cours = await CoursR.findOne({ nomCoursR: nomCours });

        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        res.status(200).json(cours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du cours' });
    }
}*/
/*
export async function GetCoursR(req, res) {
    try {
        const nomCours = req.params.nomCours;
        console.log('Nom du cours demandé :', nomCours);  // Ajoutez ce log pour vérifier le nom du cours
        
        const cours = await CoursR.findOne({ nomCoursR: nomCours });

        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        console.log('Cours trouvé :', cours);  // Ajoutez ce log pour vérifier le cours trouvé
        
        res.status(200).json(cours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du cours' });
    }
}*/


 