// studentController.js

import Student from '../models/student.js';


// Fonction pour créer un nouvel étudiant
export async function createStudent  (req, res) {
  try {
    const { firstName, lastName, password, email , cin, class : className  } = req.body;

    // Créer une nouvelle instance de Teacher avec les données reçues
    const newStudent = new Student({
      firstName,
      lastName,
      password,
      email,
      cin,
     class: className,
    });
    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent); 
 } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // En cas d'erreur, retourner un message d'erreur
  }
};
export async function  getById  (req, res)  {
    try {
      const studentId = req.params.studentId; // Récupérer l'ID de l'étudiant depuis les paramètres de la requête
  
      // Rechercher l'étudiant dans la base de données par son ID
      const student = await Student.findById(studentId);
  
      if (!student) {
        return res.status(404).json({ message: 'Étudiant introuvable' });
      }
  
      res.json(student); // Retourner l'étudiant trouvé
    } catch (error) {
      res.status(500).json({ message: error.message }); // En cas d'erreur, retourner un message d'erreur
    }
  };
  export async function deleteById (req, res)  {
  try {
    const studentId = req.params.studentId; // Récupérer l'ID de l'étudiant depuis les paramètres de la requête

    // Supprimer l'étudiant dans la base de données par son ID
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Étudiant introuvable' });
    }

    res.json({ message: 'Étudiant supprimé avec succès' }); // Retourner un message de succès
  } catch (error) {
    res.status(500).json({ message: error.message }); // En cas d'erreur, retourner un message d'erreur
  }
};
export async function updateById  (req, res) {
    try {
      const studentId = req.params.studentId; // Récupérer l'ID de l'étudiant depuis les paramètres de la requête
      const updates = req.body; // Récupérer les mises à jour des données étudiantes depuis le corps de la requête
  
      // Mettre à jour l'étudiant dans la base de données par son ID
      const student = await Student.findByIdAndUpdate(studentId, updates, { new: true });
  
      if (!student) {
        return res.status(404).json({ message: 'Étudiant introuvable' });
      }
  
      res.json(student); // Retourner l'étudiant mis à jour
    } catch (error) {
      res.status(500).json({ message: error.message }); // En cas d'erreur, retourner un message d'erreur
    }
  };

  export async function getAll (req,res) {
    try{
      const students = await Student.find();
      res.json(students); // Retourner la performance mise à jour
    } catch (error) {
      res.status(500).json({ message: error.message }); 
    }
  }
  