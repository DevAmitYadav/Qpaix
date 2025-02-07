import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>Student Management</Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/add">Add Student</Button>
          </Toolbar>
        </AppBar>
        <Container>
        <Routes>
    <Route path="/" element={<StudentList />} />
    <Route path="/add" element={<StudentForm />} />
    <Route path="/edit/:id" element={<StudentForm />} />
    </Routes>
        </Container>
        <Toaster />
      </Router>
    </Provider>
  );
};

export default App;
