
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const questionSchema = new Schema({
  idQuestion: { type: Number, required: true },
  complexity: { type: Number, required: true },
  response: { type: String, required: true },
  marks: { type: Number, required: true }
});

const Question = model('Question', questionSchema);

export default Question;
