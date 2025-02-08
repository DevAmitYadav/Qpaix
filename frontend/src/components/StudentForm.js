import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, updateStudent, fetchStudentById } from "../redux/studentSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, TextField, MenuItem, Button, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";


const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    age: yup.number().positive().integer().required("Age is required"),
    gender: yup.string().oneOf(["Male", "Female", "Other"]).required("Gender is required"),
    address: yup.string().required("Address is required"),
    phone: yup.string().matches(/^\d{10}$/, "Phone must be a 10-digit number").required("Phone is required"),
});

const StudentForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedStudent, error } = useSelector(state => state.students);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);


    useEffect(() => {
        if (isEditing) {
            dispatch(fetchStudentById(id));
        }
    }, [dispatch, id, isEditing]);

    
    useEffect(() => {
        if (isEditing && selectedStudent) {
            setValue("name", selectedStudent.name);
            setValue("email", selectedStudent.email);
            setValue("age", selectedStudent.age);
            setValue("gender", selectedStudent.gender);
            setValue("address", selectedStudent.address);
            setValue("phone", selectedStudent.phone);
            if (selectedStudent.image) {
             let url = process.env.REACT_APP_API_BASE_URL || "https://qpaix-student-management.onrender.com" ; 
                setPreview(`${url}${selectedStudent.image}`);
            }
        }
    }, [selectedStudent, setValue, isEditing]);

    
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("age", data.age);
        formData.append("gender", data.gender);
        formData.append("address", data.address);
        formData.append("phone", data.phone);
        if (image) formData.append("image", image);
    
        try {
            if (isEditing) {
                await dispatch(updateStudent({ id, studentData: formData })).unwrap();
            } else {
                await dispatch(addStudent(formData)).unwrap();
            }
            navigate("/");
        } catch (error) {
            console.error("❌ Error:", error);
        }
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}>
            <Typography variant="h5" gutterBottom align="center" color="primary">
                {isEditing ? "Edit Student" : "Add Student"}
            </Typography>

    
            {error && <Typography color="error" align="center">{error}</Typography>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Name" {...register("name")} error={!!errors.name} helperText={errors.name?.message} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Age" type="number" {...register("age")} error={!!errors.age} helperText={errors.age?.message} fullWidth />
                    </Grid>
                    
                 
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Gender"
                            {...register("gender")}
                            value={watch("gender") || ""}
                            onChange={(e) => setValue("gender", e.target.value)}
                            error={!!errors.gender}
                            helperText={errors.gender?.message}
                            fullWidth
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Address" {...register("address")} error={!!errors.address} helperText={errors.address?.message} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Phone" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} fullWidth />
                    </Grid>

                    {/* ✅ Image Upload */}
                    <Grid item xs={12} textAlign="center">
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="upload-image"
                            type="file"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="upload-image">
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<UploadFileIcon />}
                                color="secondary"
                            >
                                Upload Image
                            </Button>
                        </label>
                        {preview && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">Image Preview:</Typography>
                                <img src={preview} alt="Preview" width="120" style={{ marginTop: 10, borderRadius: 5, border: "2px solid #ddd" }} />
                            </Box>
                        )}
                    </Grid>

        
                    <Grid item xs={12} textAlign="center">
                        <Button type="submit" variant="contained" color={isEditing ? "primary" : "success"}>
                            {isEditing ? "Update" : "Add"} Student
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default StudentForm;
