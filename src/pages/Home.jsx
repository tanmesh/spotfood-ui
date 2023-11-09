import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Col, Row } from 'react-bootstrap'
import { TagsInput } from "react-tag-input-component";
import UserContext from '../context/user/UserContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import FeedItem from '../components/FeedItem'
import Button from 'react-bootstrap/Button';
import Spinner from '../shared/Loading'
import React, { useContext, useEffect, useState } from 'react'
import NoPost from '../components/NoPost'

import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';

function Home() {
    const { getAccessTokenFromContext } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [userposts, setUserposts] = useState([])
    const [lastFetched, setLastFetched] = useState(0)
    const [radius, setRadius] = useState(1);
    const [coords, setCoords] = useState({});
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
    const [selectedNewTags, setSelectedNewTags] = useState([]);
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

    const handleRange = (e) => {
        const radius = e.target.value
        setRadius(radius)
        console.log('Range selected: ', radius)
    }

    const handleTagFilter = () => {
        console.log('selectedNewTags: ', selectedNewTags)
        const body = {
            "type": "TAG",
            "tag": selectedNewTags,
        }

        console.log('body: ', body)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };
        axios.post(`http://localhost:39114/search/nearby`, body, config)
            .then((response) => {
                console.log('response.data: ', response.data)
                setUserposts([...response.data])
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('An unexpected error occurred. Please try again.');
            });
    }

    const handleRangeFilter = () => {
        if (!geolocationEnabled) {
            toast.error('Enable location to filter posts')
            return;
        }

        console.log('coord: ', coords)

        const body = {
            "type": "LOCALITY",
            "latitude": coords.latitude,
            "longitude": coords.longitude,
            "radius": radius,
        }

        console.log('body: ', body)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };
        axios.post(`http://localhost:39114/search/nearby`, body, config)
            .then((response) => {
                console.log('response.data: ', response.data)
                setUserposts([...response.data])
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('An unexpected error occurred. Please try again.');
            });
    }

    const handleClearFilter = () => {
        setSelectedNewTags([])
        setRadius(1)
    }

    useEffect(() => {
        setLoading(true)

        if (!getAccessTokenFromContext()) {
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

                axios.get(`http://localhost:39114/user_post/feeds/${lastFetched}`, config)
                    .then((response) => {
                        console.log('response.data: ', response.data)
                        setLastFetched(lastFetched + 2)
                        setUserposts(response.data)
                        setLoading(false)
                    })
                    .catch((error) => {
                        setLoading(false)
                        console.error("Error:", error);
                        if (userposts.length === 0) {
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

            axios.get('http://localhost:39114/user/profile', config)
                .then((response) => {
                    console.log('Response from http://localhost:39114/user/profile: ', response.data)
                    setProfile(response.data)
                })
                .catch((error) => {
                    console.error("Error:", error);
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
        fetchFeed()
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <Row>
                <Navbar />
            </Row>
            <Row style={{ marginTop: '7rem' }}>
                <Col xs={7} className='p-0 m-0'>
                    <Row className="m-0" style={{ marginTop: "7rem" }}>
                        <main>
                            <ul className='m-0 p-0'>
                                {userposts.map((post) => (
                                    <FeedItem
                                        key={post.postId}
                                        post={post}
                                        currentUserProfile={profile} />
                                ))}
                            </ul>

                            {userposts && userposts.length !== 0
                                ? (
                                    <div className="d-flex mt-3 justify-content-end" style={{ marginRight: '9rem' }}>
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
                <Col xs={5}>
                    <Row className='mb-2'>
                        <div
                            style={{
                                marginTop: '5rem',
                                position: 'fixed',
                                justifyContent: 'center',
                                alignContent: 'center',
                                width: '15%'
                            }}>
                            <Form style={{ marginBottom: '2rem' }}>
                                <Col xs="auto">
                                    <Form.Group>
                                        <Form.Label>
                                            Range
                                        </Form.Label>
                                        <RangeSlider
                                            value={radius}
                                            onChange={handleRange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        className='xs'
                                        onClick={handleRangeFilter}>
                                        Add range filter
                                    </Button>
                                </Col>
                            </Form>

                            <Form style={{ marginBottom: '2rem' }}>
                                <Col xs="auto">
                                    <Form.Group className="mb-3" controlId="tags">
                                        <TagsInput
                                            value={selectedNewTags}
                                            onChange={setSelectedNewTags}
                                            name="tags"
                                            placeHolder="Enter tag"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        className='xs-1'
                                        onClick={handleTagFilter}>
                                        Add tag filter
                                    </Button>
                                </Col>
                            </Form>

                            <Form>
                                <Col xs="auto">
                                    <Button
                                        className='xs-1'
                                        onClick={handleClearFilter}>
                                        Clear filter
                                    </Button>
                                </Col>
                            </Form>
                        </div>
                    </Row>

                </Col>
            </Row >
        </>
    )
}

export default Home
