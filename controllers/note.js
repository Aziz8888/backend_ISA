import Test from '../models/test.js';
import Note from '../models/note.js';

// Cette fonction pourrait être améliorée pour gérer les erreurs et cas particuliers plus spécifiques
export async function submitAnswers(req, res) {
  try {
    const { testId, answers } = req.body; // Récupération des données de la requête
    const test = await Test.findById(testId).populate('questions'); // Trouver le test et peupler les questions
    const studentId = req.user._id;
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    let totalScore = 0;
    const notes = [];

    // Itérer sur chaque question pour vérifier la réponse
    test.questions.forEach(async (question, index) => {
      const studentResponse = answers[index];
      let score = 0;

      if (question.type === 'Quiz') {
        // Pour les Quiz, vérification exacte de la réponse
        if (question.response.toLowerCase() === studentResponse.toLowerCase()) {
          score = question.marks;
        }
      } else if (question.type === 'QA') {
        // Pour les questions QA, vérification si les mots-clés sont inclus dans la réponse de l'étudiant
        const responseKeywords = question.response.toLowerCase().split(" ");
        const studentResponseWords = studentResponse.toLowerCase().split(" ");
        const matchedWords = responseKeywords.filter(word => studentResponseWords.includes(word));
        score = (matchedWords.length / responseKeywords.length) * question.marks;
      }

      // Créer et sauvegarder une note pour chaque réponse
      const note = new Note({
        studentId: mongoose.Types.ObjectId(studentId),
        questionId: question._id,
        testId: testId,
        score,
        chapitre: question.chapitre,
        complexity: question.complexity
      });
      
      await note.save();
      
      // Ajoutez la note nouvellement créée à votre tableau de notes ou à toute autre logique de suivi.
      notes.push({ questionId: question._id, score, chapitre: question.chapitre, complexity: question.complexity });
      totalScore += score;
    });

    res.status(200).json({ studentId, testId, totalScore, notes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}