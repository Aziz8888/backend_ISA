import Test from '../models/test.js';

import Note from '../models/note.js';
export async function submitAnswers(req, res) {
    try {
      const { testId, studentId, answers } = req.body;
      const test = await Test.findById(testId).populate('questions');
  
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
  
      let totalScore = 0;
      const notes = {};
      const totalScoreByChapter = {}; // Nouvel objet pour stocker la note totale par chapitre en pourcentage
  
      // Calculer les marques totales par chapitre
      const marksByChapter = {};
      test.questions.forEach(question => {
        const { chapitre, marks } = question;
        marksByChapter[chapitre] = (marksByChapter[chapitre] || 0) + marks;
      });
  
      test.questions.forEach(async (question, index) => {
        const studentResponse = answers[index];
        let score = 0;
  
        if (question.type === 'Quiz') {
          if (question.response.toLowerCase() === studentResponse.toLowerCase()) {
            score = question.marks;
          }
        } else if (question.type === 'QA') {
          const responseKeywords = question.response.toLowerCase().split(" ");
          const studentResponseWords = studentResponse.toLowerCase().split(" ");
          const matchedWords = responseKeywords.filter(word => studentResponseWords.includes(word));
          score = (matchedWords.length / responseKeywords.length) * question.marks;
        }
  
        notes[question._id] = {
          score,
          chapitre: question.chapitre,
          complexity: question.complexity
        };
  
        // Ajout du score au score total du chapitre correspondant
        totalScoreByChapter[question.chapitre] = (totalScoreByChapter[question.chapitre] || 0) + score;
  
        totalScore += score;
      });
  
      // Convertir les scores par chapitre en pourcentage par rapport à marksByChapter correspondant
      for (const chapitre in totalScoreByChapter) {
        if (marksByChapter[chapitre] !== 0) {
          totalScoreByChapter[chapitre] = (totalScoreByChapter[chapitre] / marksByChapter[chapitre]) * 100;
        } else {
          totalScoreByChapter[chapitre] = 0; // Mettre à zéro si marksByChapter est 0 pour éviter NaN
        }
      }
  
      const note = new Note({
        studentId,
        testId,
        notes,
        totalScore,
        totalScoreByChapter // Enregistrement de la note totale par chapitre en pourcentage dans l'objet note
      });
  
      await note.save();
  
      res.status(200).json({ studentId, testId, totalScore, notes, totalScoreByChapter });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  
  export async function getScoreByChapter(req, res) {
    try {
        const userId = req.params.userId;
        const notes = await Note.find({ studentId: userId, totalScoreByChapter: { $ne: null } });
    
        let combinedScoresByChapter = {};
    
        notes.forEach(note => {
          Object.entries(note.totalScoreByChapter).forEach(([chapter, score]) => {
            if (combinedScoresByChapter[chapter]) {
              combinedScoresByChapter[chapter] += score;
            } else {
              combinedScoresByChapter[chapter] = score;
            }
          });
        });
    
        res.json(combinedScoresByChapter);
      } catch (error) {
        res.status(500).send("Erreur lors de la récupération des scores par chapitre: " + error.message);
      }
}