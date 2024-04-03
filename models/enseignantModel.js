import mongoose from 'mongoose';

const enseignantSchema = new mongoose.Schema({
  idTea: {
    type: String,
    required: true,
  
  },
  password: {
    type: String,
    required: true
  }
});

const Enseignant = mongoose.model('Enseignant', enseignantSchema, 'teachers');

export default Enseignant;
