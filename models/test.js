import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const testSchema = new Schema({
  idTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
  questions: [{ type: mongoose.Schema.Types.Object, ref: 'Question' }], // Array of question IDs
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }
});

const Test = model('Test', testSchema);

export default Test;