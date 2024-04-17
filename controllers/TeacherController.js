import Teacher from '../models/Teacher.js';

const addTeacher = async (req, res) => {
  try {
    const { idTea, firstName, lastName, email, class: className , cin, password, field } = req.body;
    const newTeacher = new Teacher({
      idTea,
      firstName,
      lastName,
      email,
      class: className,
      cin,
      password,
      field
    });
    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, class: className , cin, password, field } = req.body;
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      class: className,
      cin,
      password,
      field
    }, { new: true });
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default { addTeacher, getTeacherById, getAllTeachers, updateTeacher };
