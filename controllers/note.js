import Test from "../models/test.js";
import Note from "../models/note.js";
import { google } from "googleapis";
import mongoose from "mongoose";
import axios from "axios";
import { spawn } from "child_process";


export async function submitAnswers(req, res) {
  try {
    const { testId, answers, studentId } = req.body;
    const test = await Test.findById(testId).populate("questions");
    //const studentId = req.user._id;
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Appel de la méthode pour calculer totalMarksByChapter
    const totalMarksByChapter = await calculateTotalMarksByChapter(testId);

    let totalScore = 0;
    const notes = {};
    const totalScoreByChapter = {}; // Nouvel objet pour stocker la note totale par chapitre en pourcentage
    const dataToSend = [];
    for (const question of test.questions) {
      const index = test.questions.indexOf(question);
      const studentResponse = answers[index];
      let score = 0;

      if (question.type === "Quiz") {
        if (question.response.toLowerCase() === studentResponse.toLowerCase()) {
          score = question.marks;
        }
      } else if (question.type === "QA") {
        const questionData = {
          question: question.question,
          reponse_attendue: studentResponse,
          mots_cles: question.response.split(","),
          note_totale: question.marks,
        };

        // Envoyez les données de la question au serveur Flask
        const flaskResponse = await axios.post(
          "http://127.0.0.1:9090/poser_question",
          questionData
        );
        // Traitez la réponse du serveur Flask si nécessaire
        console.log(flaskResponse.data);

        // Utilisez flaskResponse.data pour calculer le score de la question, par exemple
        score = flaskResponse.data.note_obtenue;
      }
      notes[question._id] = {
        score,
        chapitre: question.chapitre,
        complexity: question.complexity,
      };

      // Ajout du score au score total du chapitre correspondant
      totalScoreByChapter[question.chapitre] =
        (totalScoreByChapter[question.chapitre] || 0) + score;

      totalScore += score;
    }

   

    // Convertir les scores par chapitre en pourcentage par rapport à totalMarksByChapter correspondant
    for (const chapitre in totalScoreByChapter) {
      if (totalMarksByChapter[chapitre] !== 0) {
        totalScoreByChapter[chapitre] =
          (totalScoreByChapter[chapitre] / totalMarksByChapter[chapitre]) * 100;
      } else {
        totalScoreByChapter[chapitre] = 0; // Mettre à zéro si totalMarksByChapter est 0 pour éviter NaN
      }
    }

    const note = new Note({
      studentId: new mongoose.Types.ObjectId(studentId),
      testId,
      notes,
      totalScore,
      totalScoreByChapter, // Enregistrement de la note totale par chapitre en pourcentage dans l'objet note
    });

    await note.save();

    res
      .status(200)
      .json({ studentId, testId, totalScore, notes, totalScoreByChapter });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Méthode pour calculer totalMarksByChapter pour un test spécifique
async function calculateTotalMarksByChapter(testId) {
  try {
    // Trouver le test par son ID avec les données de questions peuplées
    const test = await Test.findById(testId).populate("questions");

    if (!test) {
      throw new Error("Test not found");
    }

    // Calculer totalMarksByChapter
    const totalMarksByChapter = {};
    test.questions.forEach((question) => {
      const { chapitre, marks } = question;
      totalMarksByChapter[chapitre] =
        (totalMarksByChapter[chapitre] || 0) + marks;
    });

    return totalMarksByChapter;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function recommanderVideosEtudiant(req, res) {
  try {
    const { testId, studentId } = req.params;

    // Recherchez la note correspondante dans la base de données en fonction des IDs du test et de l'étudiant
    const note = await Note.findOne({ testId, studentId });

    if (!note) {
      return res.status(404).json({
        message: "Note not found for the provided testId and studentId",
      });
    }

    // Récupérez les notes par chapitre à partir de l'objet note
    const { totalScoreByChapter } = note;

    // Configuration de l'API YouTube
    const youtube = google.youtube({
      version: "v3",
      auth: "AIzaSyDg9Xp596q0HT-XuxlKF22Ov_FCSyrKBIk",
    });

    // Fonction pour rechercher des vidéos sur YouTube
    const searchVideos = async (query, maxResults = 5) => {
      try {
        const response = await youtube.search.list({
          part: "snippet",
          q: query,
          type: "video",
          maxResults: maxResults,
        });

        const videoIds = response.data.items.map((item) => item.id.videoId);

        // Utiliser les identifiants pour récupérer les détails de chaque vidéo
        const videosResponse = await youtube.videos.list({
          part: "snippet,statistics",
          id: videoIds.join(","),
        });

        // Récupérer les détails de chaque vidéo, y compris le nombre de vues
        const videos = videosResponse.data.items.map((item) => {
          const videoId = item.id;
          const videoTitle = item.snippet.title;
          const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
          const viewCount = parseInt(item.statistics.viewCount);
          return { videoTitle, videoLink };
        });

        // Trier les vidéos par nombre de vues (du plus grand au plus petit)
        videos.sort((a, b) => b.viewCount - a.viewCount);

        return videos;
      } catch (error) {
        console.error("Error searching videos:", error);
        return null;
      }
    };

    // Parcourir les notes par chapitre et recommander les 3 vidéos les plus regardées pour chaque condition de performance
    const recommendedVideos = {};
    for (const chapitre in totalScoreByChapter) {
      const performance = totalScoreByChapter[chapitre];
      let videoQuery = "";

      if (performance >= 100) {
        
      } else if (performance >= 75) {
        videoQuery = `Java ${chapitre} tutorials`;
      } else if (performance >= 50) {
        videoQuery = `Java ${chapitre} advanced tutorials`;
      } else {
        videoQuery = `Java ${chapitre} beginner tutorials`;
      }

      if (videoQuery) {
        const videos = await searchVideos(videoQuery, 3); // Récupérer les 3 vidéos les plus regardées
        recommendedVideos[chapitre] = videos || [];
      }
    }

    res.status(200).json({ testId, studentId, recommendedVideos });
  } catch (error) {
    console.error("Error recommending videos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getAllScoresByChapter(_req, res) {
  try {
    const allNotes = await Note.find({ totalScoreByChapter: { $ne: null } });

    let combinedScoresByChapter = {};

    allNotes.forEach((notes) => {
      Object.entries(notes.totalScoreByChapter).forEach(([chapitre, score]) => {
        if (combinedScoresByChapter[chapitre]) {
          combinedScoresByChapter[chapitre] += score;
        } else {
          combinedScoresByChapter[chapitre] = score;
        }
      });
    });

    res.json(combinedScoresByChapter);
  } catch (error) {
    res
      .status(500)
      .send("Error retrieving scores by chapter: " + error.message);
  }
}

export async function getTotalScoreByTestIdAndStudentId(req, res) {
  try {
    const { testId, studentId } = req.params; // Assuming these are passed as URL parameters

    const note = await Note.findOne({
      studentId: studentId,
      testId: testId,
    });

    if (!note) {
      return res
        .status(404)
        .json({
          message: "No record found for this student and test combination",
        });
    }

    res.status(200).json({
      studentId: studentId,
      testId: testId,
      totalScore: note.totalScore,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving total score: " + error.message });
  }
}
export async function getScoreByChapter(req, res) {
  try {
    const userId = req.params.userId;
    const notes = await Note.find({
      studentId: userId,
      totalScoreByChapter: { $ne: null },
    });

    let combinedScoresByChapter = {};

    notes.forEach((note) => {
      Object.entries(note.totalScoreByChapter).forEach(([chapter, score]) => {
        if (combinedScoresByChapter[chapter]) {
          combinedScoresByChapter[chapter] += score;
        } else {
          combinedScoresByChapter[chapter] = score;
        }
      });
    });

    res.json(combinedScoresByChapter);
  } catch (error) {
    res
      .status(500)
      .send(
        "Erreur lors de la récupération des scores par chapitre: " +
          error.message
      );
  }
}

export async function predictWithFlask(req, res) {
  try {
    // Récupérer les données nécessaires de la requête
    const inputData = req.body;

    // Envoyer les données au serveur Flask
    const flaskResponse = await axios.post(
      "http://127.0.0.1:3000/predict",
      inputData
    );

    // Traiter la réponse du serveur Flask si nécessaire
    const predictions = flaskResponse.data;

    // Renvoyer les prédictions à l'utilisateur
    res.status(200).json(predictions);
  } catch (error) {
    console.error("Erreur lors de la prédiction avec Flask:", error);
    res.status(500).json({ error: "Erreur lors de la prédiction avec Flask" });
  }
}


export async function askAIQuestion(req, res) {
  try {
    // Récupérer la question de la requête
    const { question } = req.body;

    // Envoyer la question au serveur Flask
    const flaskResponse = await axios.post(
      "http://127.0.0.1:5001/ask", // Assurez-vous de changer le port si nécessaire
      { user_input: question }
    );

    // Récupérer la réponse du serveur Flask
    const aiResponse = flaskResponse.data.response;

    // Renvoyer la réponse de l'IA à l'utilisateur
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("Erreur lors de la communication avec le serveur Flask:", error);
    res.status(500).json({ error: "Erreur lors de la communication avec le serveur Flask" });
  }
}