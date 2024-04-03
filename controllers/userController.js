import Enseignant from '../models/enseignantModel.js';
import Student from '../models/studentModel.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Recherche d'un enseignant
    const enseignant = await Enseignant.findOne({ email , password });
    if (enseignant) {
      return res.status(200).json({ message: "Connexion réussie en tant qu'enseignant", user: enseignant, role: "enseignant" });
    }

    // Recherche d'un étudiant
    const student = await Student.findOne({ email, password });
    if (student) {
      return res.status(200).json({ message: "Connexion réussie en tant qu'étudiant", user: student, role: "student" });
    }

    // Aucun utilisateur trouvé avec cet identifiant
    return res.status(404).json({ message: "Identifiant ou mot de passe incorrect" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
