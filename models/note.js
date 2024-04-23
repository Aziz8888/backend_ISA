// models/Note.js
/*
/*
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
*/

//Model jdid bch naamil kol chy f un seul objet

import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Student", 
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Test",
  },
  totalScore: {
    type: Number,
    required: true,
  },
  totalScoreByChapter: {
    type: Object, // Un objet où les clés sont les identifiants de chapitre et les valeurs sont les scores totaux par chapitre
    required: true,
  },
  notes: {
    type: Map,
    of: new mongoose.Schema({
      score: Number,
      chapitre: String,
      complexity: Number,
    }),
    required: true,
  },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;