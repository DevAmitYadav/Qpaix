import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import { toast } from "react-hot-toast";


export const fetchStudents = createAsyncThunk(
    "students/fetchStudents",
    async ({ page = 1, limit = 5, search = "" }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/?page=${page}&limit=${limit}&search=${search}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const fetchStudentById = createAsyncThunk(
    "students/fetchStudentById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


export const addStudent = createAsyncThunk(
    "students/addStudent",
    async (studentData, { rejectWithValue }) => {
        try {
            const response = await api.post("/", studentData);
            toast.success("Student added successfully!");
            return response.data;
        } catch (error) {
            toast.error("Failed to add student");
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


export const updateStudent = createAsyncThunk(
    "students/updateStudent",
    async ({ id, studentData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/${id}`, studentData);
            toast.success("Student updated successfully!");
            return response.data;
        } catch (error) {
            toast.error("Failed to update student");
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


export const deleteStudent = createAsyncThunk(
    "students/deleteStudent",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/${id}`);
            toast.success("Student deleted successfully!");
            return id;
        } catch (error) {
            toast.error("Failed to delete student");
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


const studentsSlice = createSlice({
    name: "students",
    initialState: {
        students: [],
        totalPages: 1,
        currentPage: 1,
        searchQuery: "",
        loading: false,
        error: null,
        selectedStudent: null,
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudents.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.students;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchStudentById.fulfilled, (state, action) => {
                state.selectedStudent = action.payload;
            })
            .addCase(fetchStudentById.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            })
            .addCase(addStudent.fulfilled, (state, action) => {
                state.students.push(action.payload);
            })
            .addCase(addStudent.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                const index = state.students.findIndex(s => s._id === action.payload._id);
                if (index !== -1) state.students[index] = action.payload;
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.students = state.students.filter(s => s._id !== action.payload);
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            });
    },
});

export const { setSearchQuery } = studentsSlice.actions;
export default studentsSlice.reducer;
