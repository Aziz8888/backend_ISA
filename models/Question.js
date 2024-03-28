
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const questionSchema = new Schema({
  test: { type: Schema.Types.ObjectId, ref: 'Test' },
  complexity: { type: Number, required: true },
  question: { type: String, required: true },
  response: { type: String, required: true },
  marks: { type: Number, required: true },
  options: { type: String, required: false},
  type: { type: String,enum: ['QA','Quiz'], required: true }, 
  image: { type: String,required: false }
});

const Question = model('Question', questionSchema);

export default Question;
