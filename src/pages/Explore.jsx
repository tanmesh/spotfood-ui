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
import ThatsAll from '../assets/thats-all.png'

function Explore() {
    const { getAccessTokenFromContext, getEmailIdFromContext } = useContext(UserContext);
    const { getUserPostsFromContext, setUserPostsForContext, setProfileForContext } = useContext(UserPostsContext);
    const [thatsAll, setThatsAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState(0)
    const [coords, setCoords] = useState({});
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);

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

        setProfileForContext(null)

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
                    console.log('Response from /user/profile: ', response.data)
                    setProfileForContext(response.data)
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
                    console.log('response.data: ', response.data)
                    if (response.data.length === 0) {
                        setThatsAll(true)
                    }
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
                                        post={post} />
                                ))}
                            </ul>

                            {getUserPostsFromContext().length !== 0
                                ? (
                                    <div className="d-flex justify-content-center">
                                        {thatsAll
                                            ? (
                                                <img
                                                    width={window.innerWidth <= 800 ? '20%' : '5%'}
                                                    height={window.innerHeight <= 800 ? '20%' : '5%'}
                                                    src={ThatsAll}
                                                />
                                            )
                                            : (
                                                <Button
                                                    variant="outline-dark"
                                                    onClick={handleLoadMore}
                                                >
                                                    Load more
                                                </Button>
                                            )}
                                    </div>
                                )
                                : (
                                    <NoPost />
                                )
                            }
                        </main>
                    </Row>
                </Col>
            </Row >
        </>
    )
}

export default Explore
