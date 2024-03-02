import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const teacherSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  class: { type: String, required: true }, // Utilisation de guillemets inversés pour 'class'
  cin: { type: Number, required: true },
  password: { type: String, required: true },
  field: { type: String, required: true }
});

const Teacher = model('Teacher', teacherSchema);

export default Teacher;
