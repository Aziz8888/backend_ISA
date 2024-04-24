
import cloudinary from '../middlewares/cloudinary.js';
import CoursR from "../models/CoursR.js";
import fs from 'fs';
import path from 'path';

export async function AjouterCoursR(req, res) {
    try {
        const cloudinaryy = await cloudinary.uploader.upload(req.file.path, { resource_type: 'raw' });
    
        await CoursR.create({
            nomCoursR: req.body.nomCoursR,
            description: req.body.description, 
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

export async function deleteById(req, res) {
    try {
        const courseId = req.params.id; 

        const cours = await CoursR.findById(courseId);

        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        const publicId = cours.pdff.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        await CoursR.findByIdAndDelete(courseId);

        res.status(200).json({ message: 'Cours supprimé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression du cours' });
    }
}

export async function GetCoursR(req, res) {
    try {
        const nomCours = req.params.nomCours; 
        
        const cours = await CoursR.findOne({ nomCoursR: nomCours });

        if (!cours) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        const pdfPath = cours.pdff;
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ message: 'Fichier PDF non trouvé' });
        }

        
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