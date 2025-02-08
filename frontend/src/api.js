import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/students/"; // Update if needed

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data", // Support file uploads
    },
});

export default api;
