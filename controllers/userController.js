import jwt from 'jsonwebtoken';
import Enseignant from '../models/enseignantModel.js';
import Student from '../models/student.js';
import Teacher from '../models/Teacher.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Attempt to find a teacher with the given email and password
    const teacher = await Teacher.findOne({ email: email, password: password });
    if (teacher) {
      // Generate a JWT token for the teacher
      const token = jwt.sign(
        { userId: teacher._id, role: 'teacher' }, 
        'a1b2c3d4e5f6g7h8i9j10k11l12m13n14o15p16q17r18s19t20u21v22w23x24y25z26',  // Make sure to use a real secret from your configuration
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: "Login successful as teacher",
        user: teacher,
        token: token
      });
    }

    // If not found, then try finding a student
    const student = await Student.findOne({ email: email, password: password });
    if (student) {
      // Generate a JWT token for the student
      const token = jwt.sign(
        { userId: student._id, role: 'student' }, 
        'a1b2c3d4e5f6g7h8i9j10k11l12m13n14o15p16q17r18s19t20u21v22w23x24y25z26',  // Use the same secret here
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: "Login successful as student",
        user: student,
        token: token
      });
    }

    // If no user is found in either collection
    return res.status(404).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};
// Fonction pour récupérer un utilisateur par son adresse e-mail
export const getUserDetailsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Recherche d'un enseignant par email
    const enseignant = await Teacher.findOne({ email });
    // Recherche d'un étudiant par email si aucun enseignant n'a été trouvé
    const user = Student || await Student.findOne({ email });

    if (!user) {
      // Aucun utilisateur trouvé avec cet email
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet e-mail" });
    }

    // Générer un jeton JWT pour l'utilisateur trouvé
    const token = jwt.sign({ userId: user._id, role: user.role }, 'a1b2c3d4e5f6g7h8i9j10k11l12m13n14o15p16q17r18s19t20u21v22w23x24y25z26', { expiresIn: '1h' });

    // Retourner les détails de l'utilisateur avec le token
    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};