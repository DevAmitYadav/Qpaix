import Student from "../models/Student.js";


const getStudents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const query = search ? { name: { $regex: search, $options: "i" } } : {};
        
        const students = await Student.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        
        const count = await Student.countDocuments(query);
        
        res.status(200).json({
            students,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addStudent = async (req, res) => {
    try {
        const { name, email, age, gender, phone, address, course } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const newStudent = new Student({ name, email, age, gender, phone, address, course, image });
        await newStudent.save();

        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateStudent = async (req, res) => {
    try {
        const { name, email, age, gender, phone, address, course } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { name, email, age, gender, phone, address, course, image },
            { new: true }
        );

        if (!updatedStudent) return res.status(404).json({ message: "Student not found" });

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Student deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getStudents,
    addStudent,
    getStudentById,
    updateStudent,
    deleteStudent
};