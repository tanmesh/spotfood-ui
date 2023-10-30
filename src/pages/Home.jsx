import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/auth/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FeedItem from '../components/FeedItem'
import { toast } from 'react-toastify'

function Home() {
    const { getAccessTokenFromContext, setAccessTokenFromContext } = useContext(AuthContext);
    const [accessToken, setAccessToken] = useState(getAccessTokenFromContext());

    const [userposts, setUserposts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        setAccessToken(getAccessTokenFromContext())

        console.log('accessToken: ', accessToken)

        if (accessToken === null) {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }

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
                    toast.error('An unexpected error occurred. Please try again.');
                });
        }

        fetchProfile()
    }, [getAccessTokenFromContext(), navigate])

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
