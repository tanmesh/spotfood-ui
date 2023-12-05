import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from "./context/user/UserContext.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import { UserPostsProvider } from './context/userPosts/UserPostsContext.jsx';
import { TagProvider } from './context/tag/TagContext.jsx';
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Explore from "./pages/Explore.jsx";
import Footer from "./components/Footer.jsx";
import React, {useEffect} from "react";
import MyPost from './pages/MyPost.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/Navbar.jsx';
import { GlobalDebug } from './remove-consoles.js';

function App() {
  useEffect(() => {
    (process.env.REACT_APP_ENV === "production") &&
      GlobalDebug(false);
  }, []);

  return (
    <UserPostsProvider>
      <UserProvider>
        <TagProvider>
          <Router>
            <Navbar />
            <div
              className='mx-auto px-3 pb-12'
              style={{ marginTop: '6rem' }}>
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
          </Router>
          <ToastContainer />
        </TagProvider>
      </UserProvider>
    </UserPostsProvider>
  );
}

export default App;
