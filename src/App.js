import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import { UserProvider } from "./context/user/UserContext.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import React from "react";
import CreatePost from "./pages/CreatePost.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <main className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/add-post" element={<CreatePost />} />
            </Routes>
          </main>
        </div>
      </Router>
      <ToastContainer />
    </UserProvider>
  );
}

export default App;
