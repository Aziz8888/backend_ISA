import mongoose from 'mongoose';


const { Schema, model} = mongoose;
const performanceSchema = new mongoose.Schema({
  

    

    idTest: {
        type: String,
        required:true,
      
      },
      idStu: {
        type: String,
        required:true,
        
      },
     
      score: {
        type: Number,
        required:true,
       
      },
      timeTaken: {
        type: Number,
        required:true,
       
      },
     
    
     
   
    });
    const Performance = mongoose.model('Performance', performanceSchema)
    export default Performance;
    