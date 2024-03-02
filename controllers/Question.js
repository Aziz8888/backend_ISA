import Question from '../models/Question.js';

export async function createQAQuestion(req,res,next) {
  try {
    const { complexity,question, response, marks, type} = req.body;
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
      const { complexity,question, response, marks, type, options, image} = req.body;
  
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
