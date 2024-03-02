import Test from '../models/test.js';
import Question from '../models/Question.js';

export async function createTest(req, res, next) {
  try {
    const { idTeacher, title, description, duration, questionIDs } = req.body;

    // Create a new test instance
    const newTest = new Test({
      idTeacher,
      title,
      description,
      duration,
      questions: questionIDs // Assign array of question IDs
    });

    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
