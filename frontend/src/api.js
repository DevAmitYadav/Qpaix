import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://qpaix-student-management.onrender.com/api/students";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data", // Support file uploads
    },
});

export default api;
