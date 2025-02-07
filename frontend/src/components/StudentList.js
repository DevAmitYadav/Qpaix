import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, deleteStudent } from "../redux/studentSlice";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Avatar,
    TextField,
    Pagination,
    Stack,
    CircularProgress,
    Typography,
    MenuItem,
    Select
} from "@mui/material";
import { debounce } from "lodash";
import Loader from "../components/Loader/Loader.js"; // Import the loader component

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const defaultProfile = "/images/default-profile.jpg";

const StudentList = () => {
    const dispatch = useDispatch();
    const { students, totalPages, currentPage, loading, error } = useSelector(state => state.students);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(currentPage);
    const [limit, setLimit] = useState(5);

    const debouncedFetch = useCallback(
        debounce((query, pageNum, limit) => {
            dispatch(fetchStudents({ page: pageNum, limit, search: query }));
        }, 600),
        [dispatch]
    );

    useEffect(() => {
        debouncedFetch(search, page, limit);
    }, [search, page, limit, debouncedFetch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleLimitChange = (e) => {
        setLimit(e.target.value);
        setPage(1); // reset to first page on limit change
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <Paper sx={{ p: 3, textAlign: "center", color: "red" }}>
                <Typography variant="h6">⚠️ Error: {error}</Typography>
                <Typography variant="body1">Something went wrong while fetching data.</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    label="Search Students"
                    variant="outlined"
                    value={search}
                    onChange={handleSearchChange}
                />
                <Select
                    value={limit}
                    onChange={handleLimitChange}
                    displayEmpty
                    variant="outlined"
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                </Select>
            </Stack>

            {students.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: "center", color: "gray", mt: 2 }}>
                    🚫 No Students Found
                </Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#ff5722" }}>
                            <TableRow>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Age</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Gender</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Profile</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map(student => (
                                <TableRow key={student._id}>
                                    <TableCell>{student.name || "N/A"}</TableCell>
                                    <TableCell>{student.email || "N/A"}</TableCell>
                                    <TableCell>{student.age || "N/A"}</TableCell>
                                    <TableCell>{student.gender || "N/A"}</TableCell>
                                    <TableCell>
                                        <Avatar
                                            src={student.image ? `${API_BASE_URL}${student.image}` : defaultProfile}
                                            sx={{ width: 70, height: 70 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: "#4caf50", color: "white", mr: 1 }}
                                            component={Link}
                                            to={`/edit/${student._id}`}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: "#f44336", color: "white" }}
                                            onClick={() => dispatch(deleteStudent(student._id))}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="secondary"
                    size="large"
                    sx={{
                        '& .MuiPaginationItem-root': { fontWeight: 'bold', fontSize: '1rem', borderRadius: '10px' },
                        '& .Mui-selected': { backgroundColor: '#ff4081 !important', color: 'white' },
                        '& .MuiPaginationItem-page:hover': { backgroundColor: '#ff80ab', color: 'white' }
                    }}
                />
            </Stack>
        </Paper>
    );
};

export default StudentList;
