import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const testSchema = new Schema({
  idTest: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  type: { type: String, required: true }, 
  marks: { type: Number, required: true }
});

const Test = model('Test', testSchema);

export default Test;
