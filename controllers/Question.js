import Question from '../models/Question.js';

export async function createQAQuestion(req,res,next) {
  try {
    const { complexity,question, response, marks, type} = req.body;
    // Check if complexity is valid
    if (![1, 2, 3].includes(complexity)) {
      return res.status(400).json({ message: "Complexity must be 1, 2, or 3" });
    }
    const image = `${req.protocol}://${req.get('host')}/img/${req.file.filename}`;
    const newQAQuestion = new Question({
        complexity,
        question,
        response,
        marks, 
        type:'QA',
        image
    });
    await newQAQuestion.save();
    res.status(201).json(newQAQuestion); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export async function createQuizQuestion(req,res,next) {
    try {
      const { complexity,question, response, marks, type, options} = req.body;
      // Check if complexity is valid
      if (![1, 2, 3].includes(complexity)) {
        return res.status(400).json({ message: "Complexity must be 1, 2, or 3" });
      }
      const image = `${req.protocol}://${req.get('host')}/img/${req.file.filename}`;
      const newQuizQuestion = new Question({
          complexity,
          question,
          response,
          marks, 
          type:'Quiz',
          options,
          image
      });
      await newQuizQuestion.save();
      res.status(201).json(newQuizQuestion); 
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Update a question
export async function updateQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Find the question by ID and update it
    await Question.findByIdAndUpdate(id, updateFields).populate();

    res.status(200).json({ message: 'Question updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete a question
export async function deleteQuestionById(req, res, next) {
  try {
    const { id } = req.params;

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully', deletedQuestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all questions
export async function getAllQuestions(req, res, next) {
  try {
    // Get all questions from the database
    const questions = await Question.find()//.populate('questions');

    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// Get a question by id
export async function getQuestionById(req, res, next) {
  try {
    const { id } = req.params;

    // Find the test by title
    const question = await Question.findOne(id).populate();

    if (!question) {
      throw new Error('Question not found');
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}