import Test from '../models/test.js';
import Question from '../models/Question.js';
/*
export async function createTest(req, res) {
  try {
    const { idTeacher, title, description, duration, questions, testDate } = req.body;

    // Map over the questions array and create new Question instances
    const questionObjects = questions.map(questionData => {
      const { complexity, question, response, marks, chapitre, type, image } = questionData;
      return new Question({
        complexity,
        question,
        response,
        marks,
        chapitre:'Les classes et les objets',
        type:'QA',
        image
      });
    });

    // Create a new test instance with the populated questions array
    const newTest = new Test({
      idTeacher,
      title,
      description,
      duration,
      questions: questionObjects,
      testDate
    });

    // Save the new test instance to the database
    await newTest.save();

    // Populate the questions field with the actual Question objects
    await newTest.populate('questions');

    // Return the newly created test with populated questions
    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
*/ // Assurez-vous d'importer les modèles nécessaires

export async function createTest(req, res) {
  try {
    const { idTeacher, title, description, duration, questions, testDate } = req.body;

    // Map over the questions array and create new Question instances
    const questionObjects = questions.map(questionData => {
      const { complexity, question, response, marks, options, chapitre, type, image } = questionData;
      return new Question({
        complexity,
        question,
        response,
        marks,
        options,
        chapitre, // Ajout de 'chapitre' à l'instance de question
        type, // Ajout de 'type' à l'instance de question
        image
      });
    });

    // Create a new test instance with the populated questions array
    const newTest = new Test({
      idTeacher,
      title,
      description,
      duration,
      questions: questionObjects,
      testDate
    });

    // Save the new test instance to the database
    await newTest.save();

    // Populate the questions field with the actual Question objects
    await newTest.populate('questions');

    // Return the newly created test with populated questions
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
    const test = Test.findById(id)
    if (!test) {
      throw new Error('Test not found');
    }
    await test.deleteOne();
    res.status(200).json({ message: 'Test deleted' });
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