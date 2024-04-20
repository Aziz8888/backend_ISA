// models/Note.js

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'  // Assumant que vous avez un modèle Student
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Question'
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'test'
  },
  score: {
    type: Number,
    required: true
  },
  chapitre: {
    type: String,
    required: false
  },
  complexity: {
    type: Number,
    required: false
  }
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
