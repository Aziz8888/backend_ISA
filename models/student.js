import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const studentSchema = new Schema({

    firstName: {
        type: String,
      
      },
      lastName: {
        type: String,
        
      },
     
      password: {
        type: String,
       
      },
      email: {
        type: String,
       
      },
     
      cin: {
        type: Number,
        
      },
      class: {
        type: String,
       
      },
     
     
   
    });
    
    const Student = model('student', studentSchema);
    export default Student ;
    