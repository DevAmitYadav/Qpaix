import axios from "axios";

const API_BASE_URL = "https://qpaix-student-management.onrender.com/"; // Update if needed

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data", // Support file uploads
    },
});

export default api;
