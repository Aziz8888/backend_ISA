import Question from '../models/Question.js';
import Test from '../models/test.js';

export async function createTest(req, res) {
  console.log('Request Body:', req.body);
  console.log('Teacher ID:', req.body.idTeacher);
  console.log('Title:', req.body.title);
  console.log('Description:', req.body.description);
  console.log('Duration:', req.body.duration);
  console.log('Test Date:', req.body.testDate);
  console.log('Questions:', req.body.questions);
  console.log('Class:', req.body.studentsClass);

  try {
    // Extract data from request body
    const { idTeacher, title, description, duration, questions, testDate, studentsClass} = req.body;

    // Map over the questions array and create new Question instances
    const questionObjects = questions.map(questionData => {
      const { complexity, question, response, marks, options, chapitre, type } = questionData;
      return new Question({
        complexity,
        question,
        response,
        marks,
        options,
        chapitre,
        type,
      });
    });

    // Create a new test instance with the populated questions array
    const newTest = new Test({
      idTeacher,
      title,
      description,
      duration,
      questions: questionObjects,
      testDate,
      studentsClass
    });

    // Save the new test instance to the database
    await newTest.save();

    // Return the newly created test with populated questions
    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
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
export async function getChaptersByTestId(req, res) {
  try {
    const { testId } = req.params;

    // Trouver le test par son ID et peupler les questions pour accéder aux chapitres
    const test = await Test.findById(testId).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Créer un ensemble pour stocker les chapitres uniques
    const chaptersSet = new Set();

    // Ajouter le chapitre de chaque question à l'ensemble pour éviter les doublons
    test.questions.forEach(question => {
      chaptersSet.add(question.chapitre);
    });

    // Convertir l'ensemble en tableau pour le renvoyer
    const chapters = [...chaptersSet];

    res.status(200).json({ chapters });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export async function getTestById(req, res) {
  try {
      const { id } = req.params;  // Récupération de l'ID du test depuis les paramètres de la route

      // Trouver le test par son ID et peupler les questions pour accéder aux détails complets
      const test = await Test.findById(id).populate('questions');

      if (!test) {
          return res.status(404).json({ message: 'Test not found' });
      }

      res.status(200).json(test);  // Renvoyer le test trouvé
  } catch (error) {
      res.status(400).json({ message: error.message });  // Gestion des erreurs potentielles
  }
}