import Test from '../models/test.js';
import Question from '../models/Question.js';

export async function createTest(req, res, next) {
  try {
    const { idTeacher, title, description, duration, questions } = req.body;

    // Create a new test instance
    const newTest = new Test({
      idTeacher,
      title,
      description,
      duration,
      questions: questions // Assign array of question IDs
    });

    await newTest.save();
    await newTest.populate('questions');
    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update a test
export async function updateTest(req, res, next) {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Find the test by ID and update it
    await Test.findByIdAndUpdate(id, updateFields).populate('questions');

    res.status(200).json({ message: 'Test updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete a test
export async function deleteTestById(req, res, next) {
  try {
    const { id } = req.params;

    const message = await deleteTest(id);

    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Get all tests
export async function getAllTests(req, res, next) {
  try {
    // Get all tests from the database
    const tests = await Test.find()//.populate('questions');

    res.status(200).json(tests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// Get a test by title
export async function getTestByTitle(req, res, next) {
  try {
    const { title } = req.params;

    // Find the test by title
    const test = await Test.findOne( title ).populate('questions');

    if (!test) {
      throw new Error('Test not found');
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}