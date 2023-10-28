import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import React from "react";
import { UserProvider } from "./context/user/UserContext.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
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
            </Routes>
          </main>
        </div>
      </Router>
      <ToastContainer />
    </UserProvider>
  );
}

export default App;
