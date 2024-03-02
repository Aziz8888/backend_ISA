// TeacherController.js

import Teacher from '../models/Teacher.js';

// Fonction pour ajouter un enseignant à la base de données
const addTeacher = async (req, res) => {
  try {
    const { idTea, firstName, lastName, email, class: className , cin, password, field } = req.body;

    // Créer une nouvelle instance de Teacher avec les données reçues
    const newTeacher = new Teacher({
      idTea,
      firstName,
      lastName,
      email,
      class: className,
      cin,
      password,
      field
    });

    // Sauvegarder l'enseignant dans la base de données
    const savedTeacher = await newTeacher.save();

    res.status(201).json(savedTeacher); // Retourner l'enseignant ajouté
  } catch (error) {
    res.status(400).json({ message: error.message }); // En cas d'erreur, retourner un message d'erreur
  }
};

export default { addTeacher };
