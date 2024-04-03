import Performance from '../models/Performance.js';
import { spawn } from 'child_process';

// Function to run the Python script
const runPythonScript = async (performanceId, chapterGrades) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['path/to/your/script.py', JSON.stringify(chapterGrades)]);
    pythonProcess.stdout.on('data', (data) => {
      resolve(JSON.parse(data));
    });
    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });
  });
};

// Update performance with predictions
export const updatePerformanceWithPredictions = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const { chapterGrades } = req.body;

    // Run Python script to get predictions
    const predictions = await runPythonScript(performanceId, chapterGrades);

    // Update performance with predictions
    const performance = await Performance.findByIdAndUpdate(performanceId, {
      chapterGrades: predictions
    }, { new: true });

    res.json(performance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
