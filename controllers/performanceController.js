// performanceController.js

import Performance from '../models/performance.js';

// Fonction pour créer une nouvelle performance
export async function createPerformance  (req, res)  {
  try {
    const {  idTest, idStu, score, timeTaken } = req.body;

    // Créer une nouvelle instance de Performance avec les données reçues
    const newPerformance = new Performance({
      
      idTest,
      idStu,
      score,
      timeTaken,
    });
    const savedPerformance = await newPerformance.save();

    res.status(201).json(savedPerformance);
  } catch (error) {
    res.status(400).json({ message: error.message }); // En cas d'erreur, retourner un message d'erreur
  }
};

// Fonction pour récupérer une performance par son ID
export async function getById  (req, res) {
  try {
    const performanceId = req.params.id; // Récupérer l'ID de la performance depuis les paramètres de la requête

    // Rechercher la performance dans la base de données par son ID
    const performance = await Performance.findById(performanceId);

    if (!performance) {
      return res.status(404).json({ message: 'Performance introuvable' });
    }

    res.json(performance); // Retourner la performance trouvée
  } catch (error) {
    res.status(500).json({ message: error.message }); // En cas d'erreur, retourner un message d'erreur
  }
};

// Fonction pour supprimer une performance par son ID
export async function deleteById (req, res) {
  try {
    const performanceId = req.params.id; // Récupérer l'ID de la performance depuis les paramètres de la requête

    // Supprimer la performance dans la base de données par son ID
    const deletedPerformance = await Performance.findByIdAndDelete(performanceId);

    if (!deletedPerformance) {
      return res.status(404).json({ message: 'Performance introuvable' });
    }

    res.json({ message: 'Performance supprimée avec succès' }); // Retourner un message de succès
  } catch (error) {
    res.status(500).json({ message: error.message }); // En cas d'erreur, retourner un message d'erreur
  }
};

// Fonction pour mettre à jour une performance par son ID
export async function updateById  (req, res) {
  try {
    const performanceId = req.params.id; // Récupérer l'ID de la performance depuis les paramètres de la requête
    const updates = req.body; // Récupérer les mises à jour des données de performance depuis le corps de la requête

    // Mettre à jour la performance dans la base de données par son ID
    const updatedPerformance = await Performance.findByIdAndUpdate(performanceId, updates, { new: true });

    if (!updatedPerformance) {
      return res.status(404).json({ message: 'Performance introuvable' });
    }

    res.json(updatedPerformance); // Retourner la performance mise à jour
  } catch (error) {
    res.status(500).json({ message: error.message }); // En cas d'erreur, retourner un message d'erreur
  }
};

export async function getAll (req,res) {
  try{
    const performances = await Performance.find();
    res.json(performances); // Retourner la performance mise à jour
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
}