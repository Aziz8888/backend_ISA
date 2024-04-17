import jwt from 'jsonwebtoken';
import Enseignant from '../models/enseignantModel.js';
import Student from '../models/student.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Recherche d'un enseignant
    const enseignant = await Enseignant.findOne({ email, password });
    if (enseignant) {
      // Générer un jeton JWT pour l'enseignant
      const token = jwt.sign({ userId: enseignant._id, role: 'enseignant' }, 'a1b2c3d4e5f6g7h8i9j10k11l12m13n14o15p16q17r18s19t20u21v22w23x24y25z26', { expiresIn: '1h' });

      return res.status(200).json({ message: "Connexion réussie en tant qu'enseignant", user: enseignant, token });
    }

    // Recherche d'un étudiant
    const student = await Student.findOne({ email, password });
    if (student) {
      // Générer un jeton JWT pour l'étudiant
      const token = jwt.sign({ userId: student._id, role: 'student' }, 'a1b2c3d4e5f6g7h8i9j10k11l12m13n14o15p16q17r18s19t20u21v22w23x24y25z26', { expiresIn: '1h' });

      return res.status(200).json({ message: "Connexion réussie en tant qu'étudiant", user: student, token });
    }

    // Aucun utilisateur trouvé avec cet identifiant
    return res.status(404).json({ message: "Identifiant ou mot de passe incorrect" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Fonction pour récupérer un utilisateur par son adresse e-mail
export const getUserDetailsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Recherche d'un enseignant par email
    const enseignant = await Enseignant.findOne({ email });
    // Recherche d'un étudiant par email si aucun enseignant n'a été trouvé
    const user = enseignant || await Student.findOne({ email });

    if (!user) {
      // Aucun utilisateur trouvé avec cet email
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet e-mail" });
    }

    // Générer un jeton JWT pour l'utilisateur trouvé
    const token = jwt.sign({ userId: user._id, role: user.role }, 'your-secret-key-here', { expiresIn: '1h' });

    // Retourner les détails de l'utilisateur avec le token
    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};