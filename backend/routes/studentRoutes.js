import  express from "express";
import { getStudents, addStudent,getStudentById, updateStudent, deleteStudent } from "../controllers/studentController.js";
import  upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", upload.single("image"), addStudent);
router.put("/:id", upload.single("image"), updateStudent);
router.delete("/:id", deleteStudent);

export default router;
