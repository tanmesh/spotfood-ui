import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./context/auth/AuthContext.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import { Container } from "react-bootstrap";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import React from "react";
import CreatePost from "./pages/CreatePost.jsx";

import Footer from "./components/Footer.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/add-post" element={<CreatePost />} />
            </Routes>
          </Container>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
