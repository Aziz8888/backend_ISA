import Performance from '../models/Performance.js';

// Create a new performance entry
export const createPerformance = async (req, res) => {
  try {
    const performance = new Performance(req.body);
    await performance.save();
    res.status(201).json(performance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all performance entries
export const getAllPerformances = async (req, res) => {
  try {
    const performances = await Performance.find();
    res.json(performances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a performance entry by ID
export const getPerformanceById = async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
    }
    res.json(performance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a performance entry
export const updatePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
    }
    res.json(performance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a performance entry
export const deletePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndDelete(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
    }
    res.json({ message: 'Performance deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Calculate total grades for a performance
export const calculateTotalGrades = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const performance = await Performance.findById(performanceId);

    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
    }

    let totalRealGrade = 0;
    let totalPredictedGrade = 0;

    performance.chapterGrades.forEach((chapterGrade) => {
      if (chapterGrade.gradeType === 'real') {
        totalRealGrade += parseFloat(chapterGrade.grade);
      } else if (chapterGrade.gradeType === 'predicted') {
        totalPredictedGrade += parseFloat(chapterGrade.grade);
      }
    });

    res.json({ totalRealGrade, totalPredictedGrade });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Run Python script for AI with performance data
export const runPythonScript = async (req, res) => {
  try {
    const { studentId } = req.params;
    const performance = await Performance.findById(studentId);
    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
    }

    const pythonProcess = spawn('python', ['path/to/your/script.py', JSON.stringify(performance)]);
    pythonProcess.stdout.on('data', (data) => {
      res.json({ message: 'Script executed successfully', newData: JSON.parse(data) });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Calculate total grades for all performances
export const getAllTotalGrades = async (_req, res) => {
    try {
        const performances = await Performance.find();

        let totalGrades = 0;

        performances.forEach((performance) => {
            if (performance.chapterGrades && performance.chapterGrades.length > 0) {
                performance.chapterGrades[0].forEach((grade) => {
                    if (grade.grade) {
                        totalGrades += parseFloat(grade.grade);
                    }
                });
            }
        });

        res.json({ totalGrades });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default { createPerformance, getAllPerformances, getPerformanceById, updatePerformance, deletePerformance, getAllTotalGrades };
