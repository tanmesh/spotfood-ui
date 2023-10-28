import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/user/UserContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FeedItem from '../components/FeedItem'

function Home() {
    const { accessToken } = useContext(UserContext)
    const [userposts, setUserposts] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfile = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            };

            axios.get(`http://localhost:39114/user_post/feeds`, config)
                .then((response) => {
                    console.log(response.data)
                    setUserposts(response.data)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate('/sign-in')
                });
        }

        fetchProfile()
    }, [])

    return (
        <div>
            <Navbar />
            <div className="mx-3">
                <main>
                    <ul>
                        {userposts.map((post) => (
                            <FeedItem
                                key={post.postId}
                                post={post} />
                        ))}
                    </ul>
                </main>
            </div>
        </div>
    )
}

export default Home
