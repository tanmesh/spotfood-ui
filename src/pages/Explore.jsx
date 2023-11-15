import { toast } from 'react-toastify'
import { Button, Col, Row } from 'react-bootstrap';
import UserPostsContext from '../context/userPosts/UserPostsContext'
import UserContext from '../context/user/UserContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import FeedItem from '../components/FeedItem'
import Spinner from '../shared/Loading'
import NoPost from '../components/NoPost'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Explore() {
    const { getAccessTokenFromContext, getEmailIdFromContext } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const { getUserPostsFromContext, setUserPostsForContext } = useContext(UserPostsContext);
    const [lastFetched, setLastFetched] = useState(0)
    const [coords, setCoords] = useState({});
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
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

    const navigate = useNavigate()

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

    useEffect(() => {
        setLoading(true)
        enableLocation()

        console.log('process.env.REACT_APP_API_URL: ', process.env.REACT_APP_API_URL)

        const fetchFeed = async () => {
            console.log('accessToken: ', getAccessTokenFromContext())

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            axios.get(`${process.env.REACT_APP_API_URL}/user_post/explore/${lastFetched}?emailId=${getEmailIdFromContext()}`, config)
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
                });
        }
        fetchProfile()

        setLoading(false)
    }, [getAccessTokenFromContext])

    const handleLoadMore = async () => {
        const fetchFeed = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            axios.get(`${process.env.REACT_APP_API_URL}/user_post/explore/${lastFetched}?emailId=${getEmailIdFromContext()}`, config)
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

                            {getUserPostsFromContext().length !== 0
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

export default Explore
