import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthContext from '../context/auth/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import FeedItem from '../components/FeedItem'
import Button from 'react-bootstrap/Button';
import Spinner from '../shared/Loading'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';
import { TagsInput } from "react-tag-input-component";

/*
    TODO:
    1. fetch user posts when its not signed-in
*/
function Home() {
    // eslint-disable-next-line
    const { getAccessTokenFromContext, setAccessTokenFromContext } = useContext(AuthContext);
    const [accessToken, setAccessToken] = useState(getAccessTokenFromContext());
    const [userposts, setUserposts] = useState([])
    const [lastFetched, setLastFetched] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    const [radius, setRadius] = useState(1);
    const [coords, setCoords] = useState({});
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
    const [selectedNewTags, setSelectedNewTags] = useState([]);

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

    const handleRange = (e) => {
        const radius = e.target.value
        setRadius(radius)
        console.log('Range selected: ', radius)
    }

    /*
        TODO:
        as of now, only filters Tags. 

        To filter range along with tags, need to update the body
    */
    const handleTagFilter = () => {
        console.log('selectedNewTags[0]: ', selectedNewTags[0])
        const body = {
            "type": "TAG",
            "tag": selectedNewTags[0],
        }

        console.log('body: ', body)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
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
        }

        console.log('body: ', body)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
            },
        };
        axios.post(`http://localhost:39114/search/nearby?radius=${radius}`, body, config)
            .then((response) => {
                console.log('response.data: ', response.data)
                setUserposts([...response.data])
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('An unexpected error occurred. Please try again.');
            });
    }

    const fetchProfile = async () => {
        console.log('accessToken: ', accessToken)
        if (accessToken === 'null') {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
            },
        };

        axios.get(`http://localhost:39114/user_post/feeds/${lastFetched}`, config)
            .then((response) => {
                console.log('response.data: ', response.data)
                setLastFetched(lastFetched + 2)
                setUserposts(response.data)
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
                console.error("Error:", error);
                if (userposts.length === 0) {
                    return;
                }
                toast.error('An unexpected error occurred. Please try again.');
            });
    }

    const handleClearFilter = () => {
        setSelectedNewTags([])
        setRadius(1)
    }

    useEffect(() => {
        enableLocation()
        setIsLoading(true)
        setAccessToken(getAccessTokenFromContext())

        fetchProfile()
    }, [getAccessTokenFromContext, accessToken])

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
        <>
            <Row>
                <Navbar />
            </Row>
            <Row style={{ marginTop: '7rem' }}>
                <Col xs={9} className='p-0 m-0'>
                    <Row className="m-0" style={{ marginTop: "7rem" }}>
                        <main>
                            <ul className='m-0 p-0'>
                                {userposts.map((post) => (
                                    <FeedItem
                                        key={post.postId}
                                        post={post} />
                                ))}
                            </ul>
                        </main>
                    </Row>

                    {userposts.length !== 0
                        ? (
                            <div className="d-flex mt-3 justify-content-center">
                                <Button
                                    variant="btn btn btn-outline-dark"
                                    onClick={handleLoadMore}>
                                    Load more
                                </Button>
                            </div>
                        )
                        : (
                            <div>
                                Do user post to show 🥺
                            </div>
                        )}
                </Col>
                <Col xs={3}>
                    <Row className='mb-2'>
                        <div
                            style={{
                                marginTop: '10rem',
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

                            {/* {!geolocationEnabled &&
                                <div>
                                    <Button
                                        className='xs'
                                        onClick={enableLocation}>
                                        Enable location
                                    </Button>
                                </div>} */}

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
