import mongoose from 'mongoose';

const { Schema } = mongoose;

const performanceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: false
  },
  chapterGrades: [{
    grade: { type: String, required: false },
    gradeType: { type: String, enum: ['real', 'predicted'], required: true }
  }],
  testGrades: [{
    grade: { type: String, required: false },
    gradeType: { type: String, enum: ['real', 'predicted'], required: true }
  }]
});
/*
performanceSchema.pre('findOneAndUpdate', async function() {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    const chapterGrades = docToUpdate.chapterGrades.map(chapter => chapter.grade);

    // Run Python script to get predictions
    const predictions = await runPythonScript(docToUpdate._id, chapterGrades);

    // Update performance with predictions
    await this.model.findOneAndUpdate(this.getQuery(), {
      chapterGrades: predictions.map((prediction, index) => ({
        grade: prediction,
        gradeType: docToUpdate.chapterGrades[index].gradeType
      }))
    });
  } catch (err) {
    console.error('Error updating performance with predictions:', err);
  }
});
*/
const Performance = mongoose.model('Performance', performanceSchema);

export default Performance;
