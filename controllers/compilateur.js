/*import { config } from 'dotenv';
import axios from 'axios';
import cheerio from 'cheerio';
config();
const staticVariables = {
    clientId: process.env.JDoodleClientId,
    clientSecret: process.env.JDoodleClientSecret,
    stdin: "",
    language: "java",
    versionIndex: 3
  };
  
export async function addCompilateur(req, res) {
    try {
      const { script } = req.body;
      const requestData = {...staticVariables, script };
  
      const response = await axios.post('https://api.jdoodle.com/v1/execute', requestData);
  
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'exécution du code' });
    }
  };
  

export async function getQuiz(req, res) {
  try {
      const url = 'https://fr.w3docs.com/quiz/java';
      const response = await axios(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const quizElements = $('.card');
      let quiz = [];

      quizElements.each(function () {
          let question = $(this).find('.card-title').text().trim();
          let answers = [];
          $(this).find('label span').each(function () {
              answers.push($(this).text().trim());
          });
          let code = $(this).find('.language-javascript').text().trim(); // Extract Java code
          if (question !== "" && answers.length > 0) {
              question = `${question} \n ${code}`; // Concatenate question and code
              quiz.push({ question, answers });
          }
      });

      res.json(quiz);
  } catch (error) {
      res.status(500).json({ message: 'Server Error' });
  }
};
*/
/*
import { config } from 'dotenv';
import axios from 'axios';
import cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findBestMatch } from 'string-similarity';

config();

const staticVariables = {
    clientId: process.env.JDoodleClientId,
    clientSecret: process.env.JDoodleClientSecret,
    stdin: "",
    language: "java",
    versionIndex: 3
};

const ai = new GoogleGenerativeAI('AIzaSyCb__QQxCrc15mbnhjGDxJOeDMF5K_2NAo');

export async function addCompilateur(req, res) {
    try {
        const { script } = req.body;
        const requestData = {...staticVariables, script };
        const response = await axios.post('https://api.jdoodle.com/v1/execute', requestData);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'exécution du code' });
    }
};

export async function getQuiz(req, res) {
    try {
        const url = 'https://fr.w3docs.com/quiz/java';
        const response = await axios(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const quizElements = $('.card');
        let quiz = [];
        for (let i = 0; i < quizElements.length; i++) {
            let question = $(quizElements[i]).find('.card-title').text().trim();
            let answers = [];
            $(quizElements[i]).find('label span').each(function () {
                answers.push($(this).text().trim());
            });
            let code = $(quizElements[i]).find('.language-javascript').text().trim(); // Extract Java code
            if (question !== "" && answers.length > 0) {
                question = `${question} \n ${code}`; // Concatenate question and code
                // Send the question to the IA to get the correct answer
                const aiResponse = await sendQuizToIA(question);
                // Find the closest match in the answers
                const correctAnswer = findClosestMatch(aiResponse, answers);
                quiz.push({ question, answers, correctAnswer });
            }
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export async function sendQuizToIA(question) {
    try {
        const model = ai.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();
        console.log(`Question: ${question}`);
        console.log(`AI Response: ${text}`);
        return text; // Retourne le texte généré par l'IA
    } catch (error) {
        console.error('Erreur lors de l\'envoi du quiz à l\'IA', error);
        return null; // Retourne null si l'envoi a échoué
    }
};

function findClosestMatch(target, options) {
    const { bestMatchIndex } = findBestMatch(target, options);
    return options[bestMatchIndex].trim();
}
*/
import { config } from 'dotenv';
import axios from 'axios';
import cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findBestMatch } from 'string-similarity';

config();

const staticVariables = {
    clientId: process.env.JDoodleClientId,
    clientSecret: process.env.JDoodleClientSecret,
    stdin: "",
    language: "java",
    versionIndex: 3
};

const ai = new GoogleGenerativeAI('AIzaSyCb__QQxCrc15mbnhjGDxJOeDMF5K_2NAo');

//const chapters = ["Introduction à Java", "Programmation orientée objet en Java", "Gestion des exceptions et des erreurs en Java", "Collections et types de données en Java", "Fonctionnalités avancées de Java"];
//const chapters = ["Introduction", "Notions fondamentales", "Programmation orientée objet", "E/S et réseau", "Programmation graphique", "Avancées"];
const chapters = ["Les classes et les objets", "L'héritage", "le polymorphisme", "Les interfaces","encapsulation"];

export async function addCompilateur(req, res) {
    try {
        const { script } = req.body;
        const requestData = {...staticVariables, script };
        const response = await axios.post('https://api.jdoodle.com/v1/execute', requestData);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'exécution du code' });
    }
};

export async function getQuiz(req, res) {
    try {
        const url = 'https://fr.w3docs.com/quiz/java';
        const response = await axios(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const quizElements = $('.card');
        let quizPromises = [];

        for (let i = 0; i < quizElements.length; i++) {
            let question = $(quizElements[i]).find('.card-title').text().trim();
            let choices = [];
            $(quizElements[i]).find('label span').each(function () {
                choices.push($(this).text().trim());
            });
            let code = $(quizElements[i]).find('.language-javascript').text().trim();
            if (question !== "" && choices.length > 0) {
                question = `${question} \n ${code}`; 

                const aiResponsePromise = sendQuizToIA(question);
                const aiChapterPromise = sendQuizToIA(question);
                quizPromises.push(Promise.all([aiResponsePromise, aiChapterPromise]).then(([aiResponse, aiChapter]) => {
 
                    const correctAnswer = findClosestMatch(aiResponse, choices);
                    
                    const Chapter = findClosestMatch(aiChapter, chapters);
                    return { question, choices, correctAnswer, Chapter }; 
                }));
            }
        }
        const quiz = await Promise.all(quizPromises);
        const chapterPercentages = calculateChapterPercentages(quiz);
        res.json({ quiz, chapterPercentages });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export async function sendQuizToIA(question) {
    try {
        const model = ai.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();
       // console.log(`Question: ${question}`);
        // console.log(`AI Response: ${text}`);
        return text; // Retourne le texte généré par l'IA
    } catch (error) {
       // console.error('Erreur lors de l\'envoi du quiz à l\'IA', error);
        return "Désolé, je ne peux pas répondre à cette question."; // Retourne une réponse par défaut
    }
};

function findClosestMatch(target, options) {
    const { bestMatchIndex } = findBestMatch(target, options);
    return options[bestMatchIndex].trim();
}

function calculateChapterPercentages(quiz) {
    const chapterCounts = chapters.reduce((counts, chapter) => ({ ...counts, [chapter]: 0 }), {});
    const totalQuestions = quiz.length;

    quiz.forEach(q => {
        chapterCounts[q.Chapter]++;
    });

    const chapterPercentages = {};
    for (const chapter in chapterCounts) {
        chapterPercentages[chapter] = (chapterCounts[chapter] / totalQuestions) * 100;
    }

    return chapterPercentages;
}
/*
import { config } from 'dotenv';
import axios from 'axios';
import cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findBestMatch } from 'string-similarity';

config();

const staticVariables = {
    clientId: process.env.JDoodleClientId,
    clientSecret: process.env.JDoodleClientSecret,
    stdin: "",
    language: "java",
    versionIndex: 3
};

const ai = new GoogleGenerativeAI('AIzaSyCb__QQxCrc15mbnhjGDxJOeDMF5K_2NAo');

export async function addCompilateur(req, res) {
    try {
        const { script } = req.body;
        const requestData = {...staticVariables, script };
        const response = await axios.post('https://api.jdoodle.com/v1/execute', requestData);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'exécution du code' });
    }
};

export async function getQuiz(req, res) {
    try {
        const url = 'https://fr.w3docs.com/quiz/java';
        const response = await axios(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const quizElements = $('.card');
        let quizPromises = [];
        const chapters = ["Introduction à Java", "Programmation orientée objet en Java", "Gestion des exceptions et des erreurs en Java", "Collections et types de données en Java", "Fonctionnalités avancées de Java"];
        for (let i = 0; i < quizElements.length; i++) {
            let question = $(quizElements[i]).find('.card-title').text().trim();
            let answers = [];
            $(quizElements[i]).find('label span').each(function () {
                answers.push($(this).text().trim());
            });
            let code = $(quizElements[i]).find('.language-javascript').text().trim();
            if (question !== "" && answers.length > 0) {
                question = `${question} \n ${code}`;
                quizPromises.push(sendQuizToIA(question).then(aiResponse => {
                    const correctAnswer = findClosestMatch(aiResponse, answers);
                    const chapter = chapters[i % chapters.length];
                    return { question, answers, correctAnswer, chapter };
                }));
            }
        }
        const quiz = await Promise.all(quizPromises);
        const chapterPercentages = calculateChapterPercentages(quiz);
        res.json({ quiz, chapterPercentages });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export async function sendQuizToIA(question) {
    try {
        const model = ai.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        return "Désolé, je ne peux pas répondre à cette question.";
    }
};

function findClosestMatch(target, options) {
    const { bestMatchIndex } = findBestMatch(target, options);
    return options[bestMatchIndex].trim();
}

function calculateChapterPercentages(quiz) {
    const chapterCounts = {};
    for (let i = 0; i < quiz.length; i++) {
        const chapter = quiz[i].chapter;
        if (chapterCounts[chapter]) {
            chapterCounts[chapter].push(i + 1);
        } else {
            chapterCounts[chapter] = [i + 1];
        }
    }
    const totalQuestions = quiz.length;
    const chapterPercentages = {};
    for (const chapter in chapterCounts) {
        const chapterQuestionCount = chapterCounts[chapter].length;
        const questionNumbers = `(${chapterCounts[chapter].join(',')})`;
        chapterPercentages[`${chapter} ${questionNumbers}`] = (chapterQuestionCount / totalQuestions) * 100;
    }
    return chapterPercentages;
}*/

/*
import { config } from 'dotenv';
import axios from 'axios';
import cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findBestMatch } from 'string-similarity';

config();

const staticVariables = {
    clientId: process.env.JDoodleClientId,
    clientSecret: process.env.JDoodleClientSecret,
    stdin: "",
    language: "java",
    versionIndex: 3
};

const ai = new GoogleGenerativeAI('AIzaSyCb__QQxCrc15mbnhjGDxJOeDMF5K_2NAo');

//const chapters = ["Introduction à Java", "Programmation orientée objet en Java", "Gestion des exceptions et des erreurs en Java", "Collections et types de données en Java", "Fonctionnalités avancées de Java"];
//const chapters = ["Introduction", "Notions fondamentales", "Programmation orientée objet", "E/S et réseau", "Programmation graphique", "Avancées"];
const chapters = ["Les classes et les objets", "L'héritage", "le polymorphisme", "Les interfaces","encapsulation"];

export async function addCompilateur(req, res) {
    try {
        const { script } = req.body;
        const requestData = {...staticVariables, script };
        const response = await axios.post('https://api.jdoodle.com/v1/execute', requestData);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'exécution du code' });
    }
};

export async function getQuiz(req, res) {
    try {
        const url = 'https://fr.w3docs.com/quiz/java';
        const response = await axios(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const quizElements = $('.card');
        let quizPromises = [];

        for (let i = 0; i < quizElements.length; i++) {
            let question = $(quizElements[i]).find('.card-title').text().trim();
            let choices = [];
            $(quizElements[i]).find('label span').each(function () {
                choices.push($(this).text().trim());
            });
            let code = $(quizElements[i]).find('.language-javascript').text().trim();
            if (question !== "" && choices.length > 0) {
                question = `${question} \n ${code}`; 

                const aiResponsePromise = sendQuizToIA(question);
                const aiChapterPromise = sendQuizToIA(question);
                quizPromises.push(Promise.all([aiResponsePromise, aiChapterPromise]).then(([aiResponse, aiChapter]) => {
 
                    const correctAnswer = findClosestMatch(aiResponse, choices);
                    
                    const Chapter = findClosestMatch(aiChapter, chapters);
                    return { question, choices, correctAnswer, Chapter }; 
                }));
            }
        }
        const quiz = await Promise.all(quizPromises);
        const chapterPercentages = calculateChapterPercentages(quiz);
        res.json({ quiz, chapterPercentages });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export async function sendQuizToIA(question) {
    try {
        const model = ai.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();
       // console.log(`Question: ${question}`);
        // console.log(`AI Response: ${text}`);
        return text; // Retourne le texte généré par l'IA
    } catch (error) {
       // console.error('Erreur lors de l\'envoi du quiz à l\'IA', error);
        return "Désolé, je ne peux pas répondre à cette question."; // Retourne une réponse par défaut
    }
};

function findClosestMatch(target, options) {
    const { bestMatchIndex } = findBestMatch(target, options);
    return options[bestMatchIndex].trim();
}

function calculateChapterPercentages(quiz) {
    const chapterCounts = chapters.reduce((counts, chapter) => ({ ...counts, [chapter]: 0 }), {});
    const totalQuestions = quiz.length;

    quiz.forEach(q => {
        chapterCounts[q.Chapter]++;
    });

    const chapterPercentages = {};
    for (const chapter in chapterCounts) {
        chapterPercentages[chapter] = (chapterCounts[chapter] / totalQuestions) * 100;
    }

    return chapterPercentages;
}
*/
/*

import { config } from 'dotenv';
import axios from 'axios';
import cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findBestMatch } from 'string-similarity';

config();

const staticVariables = {
    clientId: process.env.JDoodleClientId,
    clientSecret: process.env.JDoodleClientSecret,
    stdin: "",
    language: "java",
    versionIndex: 3
};

const ai = new GoogleGenerativeAI('AIzaSyCb__QQxCrc15mbnhjGDxJOeDMF5K_2NAo');

//const chapters = ["Introduction à Java", "Programmation orientée objet en Java", "Gestion des exceptions et des erreurs en Java", "Collections et types de données en Java", "Fonctionnalités avancées de Java"];
//const chapters = ["Introduction", "Notions fondamentales", "Programmation orientée objet", "E/S et réseau", "Programmation graphique", "Avancées"];
const chapters = ["Les classes et les objets", "L'héritage", "le polymorphisme", "Les interfaces","encapsulation"];

export async function addCompilateur(req, res) {
    try {
        const { script } = req.body;
        const requestData = {...staticVariables, script };
        const response = await axios.post('https://api.jdoodle.com/v1/execute', requestData);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'exécution du code' });
    }
};

export async function getQuiz(req, res) {
    try {
        const url = 'https://fr.w3docs.com/quiz/java';
        const response = await axios(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const quizElements = $('.card');
        let quizPromises = [];

        for (let i = 0; i < quizElements.length; i++) {
            let question = $(quizElements[i]).find('.card-title').text().trim();
            let answers = [];
            $(quizElements[i]).find('label span').each(function () {
                answers.push($(this).text().trim());
            });
            let code = $(quizElements[i]).find('.language-javascript').text().trim();
            if (question !== "" && answers.length > 0) {
                question = `${question} \n ${code}`; 

                const aiResponsePromise = sendQuizToIA(question);
                const aiChapterPromise = sendQuizToIA(question);
                quizPromises.push(Promise.all([aiResponsePromise, aiChapterPromise]).then(([aiResponse, aiChapter]) => {
 
                    const correctAnswer = findClosestMatch(aiResponse, answers);
                    
                    const Chapter = findClosestMatch(aiChapter, chapters);
                    return { question, answers, correctAnswer, Chapter }; 
                }));
            }
        }
        const quiz = await Promise.all(quizPromises);
        const chapterPercentages = calculateChapterPercentages(quiz);
        res.json({ quiz, chapterPercentages });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export async function sendQuizToIA(question) {
    try {
        const model = ai.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();
       // console.log(`Question: ${question}`);
        // console.log(`AI Response: ${text}`);
        return text; // Retourne le texte généré par l'IA
    } catch (error) {
       // console.error('Erreur lors de l\'envoi du quiz à l\'IA', error);
        return "Désolé, je ne peux pas répondre à cette question."; // Retourne une réponse par défaut
    }
};

function findClosestMatch(target, options) {
    const { bestMatchIndex } = findBestMatch(target, options);
    return options[bestMatchIndex].trim();
}

function calculateChapterPercentages(quiz) {
    const chapterCounts = chapters.reduce((counts, chapter) => ({ ...counts, [chapter]: 0 }), {});
    const totalQuestions = quiz.length;

    quiz.forEach(q => {
        chapterCounts[q.Chapter]++;
    });

    const chapterPercentages = {};
    for (const chapter in chapterCounts) {
        chapterPercentages[chapter] = (chapterCounts[chapter] / totalQuestions) * 100;
    }

    return chapterPercentages;
}
*/
/*
import { config } from 'dotenv';
import axios from 'axios';
import cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findBestMatch } from 'string-similarity';

config();

const staticVariables = {
    clientId: process.env.JDoodleClientId,
    clientSecret: process.env.JDoodleClientSecret,
    stdin: "",
    language: "java",
    versionIndex: 3
};

const ai = new GoogleGenerativeAI('AIzaSyCb__QQxCrc15mbnhjGDxJOeDMF5K_2NAo');

//const chapters = ["Introduction à Java", "Programmation orientée objet en Java", "Gestion des exceptions et des erreurs en Java", "Collections et types de données en Java", "Fonctionnalités avancées de Java"];
//const chapters = ["Introduction", "Notions fondamentales", "Programmation orientée objet", "E/S et réseau", "Programmation graphique", "Avancées"];
const chapters = ["Les classes et les objets", "L'héritage", "le polymorphisme", "Les interfaces","encapsulation"];

export async function addCompilateur(req, res) {
    try {
        const { script } = req.body;
        const requestData = {...staticVariables, script };
        const response = await axios.post('https://api.jdoodle.com/v1/execute', requestData);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'exécution du code' });
    }
};

export async function getQuiz(req, res) {
    try {
        const url = 'https://fr.w3docs.com/quiz/java';
        const response = await axios(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const quizElements = $('.card');
        let quizPromises = [];

        for (let i = 0; i < quizElements.length; i++) {
            let question = $(quizElements[i]).find('.card-title').text().trim();
            let answers = [];
            $(quizElements[i]).find('label span').each(function () {
                answers.push($(this).text().trim());
            });
            let code = $(quizElements[i]).find('.language-javascript').text().trim();
            if (question !== "" && answers.length > 0) {
                question = `${question} \n ${code}`; 

                const aiResponsePromise = sendQuizToIA(question);
                const aiChapterPromise = sendQuizToIA(question);
                quizPromises.push(Promise.all([aiResponsePromise, aiChapterPromise]).then(([aiResponse, aiChapter]) => {
 
                    const correctAnswer = findClosestMatch(aiResponse, answers);
                    
                    const Chapter = findClosestMatch(aiChapter, chapters);
                    return { question, answers, correctAnswer, Chapter }; 
                }));
            }
        }
        const quiz = await Promise.all(quizPromises);
        const chapterPercentages = calculateChapterPercentages(quiz);
        res.json({ quiz, chapterPercentages });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export async function sendQuizToIA(question) {
    try {
        const model = ai.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();
       // console.log(`Question: ${question}`);
        // console.log(`AI Response: ${text}`);
        return text; // Retourne le texte généré par l'IA
    } catch (error) {
       // console.error('Erreur lors de l\'envoi du quiz à l\'IA', error);
        return "Désolé, je ne peux pas répondre à cette question."; // Retourne une réponse par défaut
    }
};

function findClosestMatch(target, options) {
    const { bestMatchIndex } = findBestMatch(target, options);
    return options[bestMatchIndex].trim();
}

function calculateChapterPercentages(quiz) {
    const chapterCounts = chapters.reduce((counts, chapter) => ({ ...counts, [chapter]: 0 }), {});
    const totalQuestions = quiz.length;

    quiz.forEach(q => {
        chapterCounts[q.Chapter]++;
    });

    const chapterPercentages = {};
    for (const chapter in chapterCounts) {
        chapterPercentages[chapter] = (chapterCounts[chapter] / totalQuestions) * 100;
    }

    return chapterPercentages;
}*/