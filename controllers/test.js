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