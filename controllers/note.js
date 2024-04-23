import Test from "../models/test.js";
import Note from "../models/note.js";
import { google } from 'googleapis'


////tekhdem avec note par chapitre et pourcentage


export async function submitAnswers(req, res) {
  try {
    const { testId, studentId, answers } = req.body;
    const test = await Test.findById(testId).populate('questions');

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    let totalScore = 0;
    const notes = {};
    const totalScoreByChapter = {}; // Nouvel objet pour stocker la note totale par chapitre en pourcentage

    // Calculer les marques totales par chapitre
    const marksByChapter = {};
    test.questions.forEach(question => {
      const { chapitre, marks } = question;
      marksByChapter[chapitre] = (marksByChapter[chapitre] || 0) + marks;
    });

    test.questions.forEach(async (question, index) => {
      const studentResponse = answers[index];
      let score = 0;

      if (question.type === 'Quiz') {
        if (question.response.toLowerCase() === studentResponse.toLowerCase()) {
          score = question.marks;
        }
      } else if (question.type === 'QA') {
        const responseKeywords = question.response.toLowerCase().split(" ");
        const studentResponseWords = studentResponse.toLowerCase().split(" ");
        const matchedWords = responseKeywords.filter(word => studentResponseWords.includes(word));
        score = (matchedWords.length / responseKeywords.length) * question.marks;
      }

      notes[question._id] = {
        score,
        chapitre: question.chapitre,
        complexity: question.complexity
      };

      // Ajout du score au score total du chapitre correspondant
      totalScoreByChapter[question.chapitre] = (totalScoreByChapter[question.chapitre] || 0) + score;

      totalScore += score;
    });

    // Convertir les scores par chapitre en pourcentage par rapport à marksByChapter correspondant
    for (const chapitre in totalScoreByChapter) {
      if (marksByChapter[chapitre] !== 0) {
        totalScoreByChapter[chapitre] = (totalScoreByChapter[chapitre] / marksByChapter[chapitre]) * 100;
      } else {
        totalScoreByChapter[chapitre] = 0; // Mettre à zéro si marksByChapter est 0 pour éviter NaN
      }
    }

    const note = new Note({
      studentId,
      testId,
      notes,
      totalScore,
      totalScoreByChapter // Enregistrement de la note totale par chapitre en pourcentage dans l'objet note
    });

    await note.save();

    res.status(200).json({ studentId, testId, totalScore, notes, totalScoreByChapter });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function recommanderVideosEtudiant(req, res) {
  try {
    const { testId, studentId } = req.params;

    // Recherchez la note correspondante dans la base de données en fonction des IDs du test et de l'étudiant
    const note = await Note.findOne({ testId, studentId });

    if (!note) {
      return res
        .status(404)
        .json({
          message: "Note not found for the provided testId and studentId",
        });
    }

    // Récupérez les notes par chapitre à partir de l'objet note
    const { totalScoreByChapter } = note;

    // Configuration de l'API YouTube
    const youtube = google.youtube({
      version: "v3",
      auth: "AIzaSyDg9Xp596q0HT-XuxlKF22Ov_FCSyrKBIk", // Remplacez par votre clé d'API YouTube
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
        recommendedVideos[chapitre] = [];
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
