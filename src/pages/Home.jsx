import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthContext from '../context/auth/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import FeedItem from '../components/FeedItem'
import Button from 'react-bootstrap/Button';
import Spinner from '../shared/Loading'
import React, { useContext, useEffect, useState } from 'react'

function Home() {
    // eslint-disable-next-line
    const { getAccessTokenFromContext, setAccessTokenFromContext } = useContext(AuthContext);
    const [accessToken, setAccessToken] = useState(getAccessTokenFromContext());
    const [userposts, setUserposts] = useState([])
    const [lastFetched, setLastFetched] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)
        setAccessToken(getAccessTokenFromContext())

        if (accessToken === 'null') {
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

            axios.get(`http://localhost:39114/user_post/feeds/${lastFetched}`, config)
                .then((response) => {
                    setLastFetched(lastFetched + 2)
                    setUserposts(response.data)
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('An unexpected error occurred. Please try again.');
                });
        }

        fetchProfile()
    }, [getAccessTokenFromContext, navigate, accessToken])

    const handleLoadMore = async () => {
        const fetchProfile = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            };

            axios.get(`http://localhost:39114/user_post/feeds/${lastFetched}`, config)
                .then((response) => {
                    setLastFetched(lastFetched + 2)
                    setUserposts((prevState) => [...prevState, ...response.data])
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('An unexpected error occurred. Please try again.');
                });
        }

        fetchProfile()
    }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div>
            <Navbar />
            <div className="mx-3" style={{ marginTop: "7rem" }}>
                <main>
                    <ul className='m-0 p-0'>
                        {userposts.map((post) => (
                            <FeedItem
                                key={post.postId}
                                post={post} />
                        ))}
                    </ul>
                </main>
            </div>
            <div className="d-flex mt-3 justify-content-center">
                <Button variant="btn btn btn-outline-dark" type="submit" onClick={handleLoadMore}>
                    Load more
                </Button>
            </div>
        </div>
    )
}

export default Home
