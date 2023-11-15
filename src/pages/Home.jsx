import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Col, Row } from 'react-bootstrap';
import UserContext from '../context/user/UserContext'
import UserPostsContext from '../context/userPosts/UserPostsContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import FeedItem from '../components/FeedItem'
import NoPost from '../components/NoPost'
import Spinner from '../shared/Loading'
import React, { useContext, useEffect, useState } from 'react'

function Home() {
    const { getAccessTokenFromContext } = useContext(UserContext);
    const { getUserPostsFromContext, setUserPostsForContext } = useContext(UserPostsContext);
    const [loading, setLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState(0)
    const [coords, setCoords] = useState({});
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);

    const navigate = useNavigate()

    const [profile, setProfile] = useState({
        emailId: '',
        firstName: '',
        lastName: '',
        followingList: [],
        followersList: [],
        tagList: [],
        nickName: '',
        password: '',
    })

    useEffect(() => {
        setLoading(true)

        console.log('accessToken: ', getAccessTokenFromContext())
        if (getAccessTokenFromContext() === 'null') {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }

        const enableLocation = () => {
            // use current location
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords(position.coords)
                    console.log('location is enabled', position.coords)
                    setGeolocationEnabled(true)
                },
                (error) => {
                    console.log('location is disabled: ', error)
                },
                options
            );
        }
        enableLocation()

        const fetchFeed = async () => {
            try {
                console.log('accessToken: ', getAccessTokenFromContext())
                if (getAccessTokenFromContext() === 'null') {
                    console.log('accessToken is null')
                    navigate('/sign-in')
                    return;
                }

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': getAccessTokenFromContext(),
                    },
                };

                axios.get(`${process.env.REACT_APP_API_URL}/user_post/feeds/${lastFetched}`, config)
                    .then((response) => {
                        console.log('response.data: ', response.data)
                        setLastFetched(lastFetched + 2)
                        setUserPostsForContext(response.data)
                        setLoading(false)
                    })
                    .catch((error) => {
                        setLoading(false)
                        console.error("Error:", error);
                        if (getUserPostsFromContext().length === 0) {
                            return;
                        }
                        toast.error('An unexpected error occurred. Please try again.');
                    });
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
        fetchFeed()

        const fetchProfile = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getAccessTokenFromContext(),
                },
            };

            axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, config)
                .then((response) => {
                    console.log('Response from ${process.env.REACT_APP_API_URL}/user/profile: ', response.data)
                    setProfile(response.data)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Please Sign In again.');
                    navigate('/sign-in')
                });
        }
        fetchProfile()

        setLoading(false)
    }, [])

    const handleLoadMore = async () => {
        const fetchFeed = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getAccessTokenFromContext(),
                },
            };

            axios.get(`${process.env.REACT_APP_API_URL}/user_post/feeds/${lastFetched}`, config)
                .then((response) => {
                    setLastFetched(lastFetched + 2)
                    setUserPostsForContext((prevState) => [...prevState, ...response.data])
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('An unexpected error occurred. Please try again.');
                });
        }
        fetchFeed()
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <Row>
                <Navbar
                    coords={coords}
                    geolocationEnabled={geolocationEnabled}
                />
            </Row>
            <Row style={{ marginTop: window.innerWidth <= 800 ? '7rem' : '5rem' }}>
                <Col>
                    <Row>
                        <main style={{ paddingRight: '0' }}>
                            <ul className='p-2'>
                                {getUserPostsFromContext().map((post) => (
                                    <FeedItem
                                        key={post.postId}
                                        post={post}
                                        currentUserProfile={profile} />
                                ))}
                            </ul>

                            {getUserPostsFromContext() && getUserPostsFromContext().length !== 0
                                ? (
                                    <div className="d-flex justify-content-center">
                                        <Button
                                            variant="btn btn btn-outline-dark"
                                            onClick={handleLoadMore}>
                                            Load more
                                        </Button>
                                    </div>
                                )
                                : (
                                    <NoPost />
                                )}
                        </main>
                    </Row>
                </Col>
            </Row >
        </>
    )
}

export default Home
