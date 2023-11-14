import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from "./context/user/UserContext.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import { UserPostsProvider } from './context/userPosts/UserPostsContext.jsx';
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Explore from "./pages/Explore.jsx";
import Footer from "./components/Footer.jsx";
import React from "react";
import MyPost from './pages/MyPost.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <UserPostsProvider>
      <UserProvider>
        <Router>
          <div>
            <div>
              <Routes>
                <Route path="/" element={<Home />} exact />
                <Route path="/profile" element={<Profile />} exact />
                <Route path="/about" element={<About />} exact />
                <Route path="/sign-in" element={<SignIn />} exact />
                <Route path="/sign-up" element={<SignUp />} exact />
                <Route path="/add-post" element={<CreatePost />} exact />
                <Route path="/explore" element={<Explore />} exact />
                <Route path='/my-posts' element={<MyPost />} exact />
                <Route path='/*' element={<NotFound />} exact />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
        <ToastContainer />
      </UserProvider>
    </UserPostsProvider>
  );
}

export default App;
