import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const teacherSchema = new Schema({
 
 
  idTea:{
    type: Number,
    
  },
  firstName: {
    type: String,
  
  },
  lastName: {
    type: String,
    
  },
  email: {
    type: String,
   
  },
  class: [{
    type: String,
   
  }],
  cin: {
    type: Number,
    
  },
  password: {
    type: String,
   
  },
  field: {
    type: String,
   
  },
  
  
  
 
});



const Teacher = model('Teacher', teacherSchema);

export default Teacher;
