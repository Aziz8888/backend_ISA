import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  emai: {
    type: String,
    required: true,
    
  },
  password: {
    type: String,
    required: true
  }
});

const StudentModel = mongoose.model('Student', studentSchema);

export default StudentModel;
