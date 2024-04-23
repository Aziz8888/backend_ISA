import axios from "axios";
import cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findBestMatch } from "string-similarity";

const ai = new GoogleGenerativeAI("AIzaSyCb__QQxCrc15mbnhjGDxJOeDMF5K_2NAo");
const chapters = [
  "Les classes et les objets",
  "L'héritage",
  "Le polymorphisme",
  "Les interfaces",
  "Encapsulation",
];
export async function getQuiz(req, res) {
  try {
    const url = "https://fr.w3docs.com/quiz/java";
    const response = await axios(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const quizElements = $(".card");
    let quizPromises = [];

    for (let i = 0; i < quizElements.length; i++) {
      let question = $(quizElements[i]).find(".card-title").text().trim();
      let answers = [];
      $(quizElements[i])
        .find("label span")
        .each(function () {
          answers.push($(this).text().trim());
        });
      let code = $(quizElements[i]).find(".language-javascript").text().trim();
      if (question !== "" && answers.length > 0) {
        question = `${question} \n ${code}`;

        const aiResponsePromise = sendQuizToIA(question);
        const aiChapterPromise = sendQuizToIA(question);
        quizPromises.push(
          Promise.all([aiResponsePromise, aiChapterPromise]).then(
            ([aiResponse, aiChapter]) => {
              const correctAnswer = findClosestMatch(aiResponse, answers);

              const Chapter = findClosestMatch(aiChapter, chapters);
              return { question, answers, correctAnswer, Chapter };
            }
          )
        );
      }
    }
    const quiz = await Promise.all(quizPromises);
    const chapterPercentages = calculateChapterPercentages(quiz);
    res.json({ quiz, chapterPercentages });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function sendQuizToIA(question) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(question);
    const response = await result.response;
    const text = await response.text();

    return text;
  } catch (error) {
    return "Désolé, je ne peux pas répondre à cette question.";
  }
}

function findClosestMatch(target, options) {
  const { bestMatchIndex } = findBestMatch(target, options);
  return options[bestMatchIndex].trim();
}

function calculateChapterPercentages(quiz) {
  const chapterCounts = chapters.reduce(
    (counts, chapter) => ({ ...counts, [chapter]: 0 }),
    {}
  );
  const totalQuestions = quiz.length;

  quiz.forEach((q) => {
    chapterCounts[q.Chapter]++;
  });

  const chapterPercentages = {};
  for (const chapter in chapterCounts) {
    chapterPercentages[chapter] =
      (chapterCounts[chapter] / totalQuestions) * 100;
  }

  return chapterPercentages;
}