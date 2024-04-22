import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const testSchema = new Schema({
  idTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
  questions: [{
    complexity: { type: Number, required: true },
    question: { type: String, required: true },
    response: { type: String, required: true },
    marks: { type: Number, required: true },
    options: [{ type: String, required: false }], // Modifié pour être un tableau de strings
    chapitre: {type: String, enum: ['Les classes et les objets','L héritage',
      'Le polymorphisme','Les interfaces','Encapsulation'],required:false},
    type: { type: String,enum: ['QA','Quiz'], required: true }, 
    image: { type: String,required: false }
  }],
  title: { type: String, required: true },
  description: { type: String, required: true },
  testDate: {type: Date, required: true},
  duration: { type: Number, required: true }
});

const Test = model('Test', testSchema);

export default Test;
