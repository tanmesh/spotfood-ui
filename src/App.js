import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from "./context/user/UserContext.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Explore from "./pages/Explore.jsx";
import Footer from "./components/Footer.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import React from "react";

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/add-post" element={<CreatePost />} />
              <Route path="/explore" element={<Explore />} />
            </Routes>
          </>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </UserProvider>
  );
}

export default App;
