import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'  // Assumant que vous avez un modèle Student
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Test'
  },
  totalScore: {
    type: Number,
    required: true
  },
  totalScoreByChapter: {
    type: Object, // Un objet où les clés sont les identifiants de chapitre et les valeurs sont les scores totaux par chapitre
    required: true
  },
  notes: {
    type: Map,
    of: new mongoose.Schema({
      score: Number,
      chapitre: String,
      complexity: Number
    }),
    required: true
  }
});

const Note = mongoose.model('Note', noteSchema);

export default Note;