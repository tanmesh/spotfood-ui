import { toast } from 'react-toastify'
import { TagsInput } from "react-tag-input-component";
import UserContext from '../context/user/UserContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import FeedItem from '../components/FeedItem'
import { Button, Col, Row, Modal, Form } from 'react-bootstrap';
import Spinner from '../shared/Loading'
import React, { useContext, useEffect, useState } from 'react'
import NoPost from '../components/NoPost'
import RangeSlider from 'react-bootstrap-range-slider';

function Explore() {
    const { getAccessTokenFromContext } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [userposts, setUserposts] = useState([])
    const [lastFetched, setLastFetched] = useState(0)
    const [radius, setRadius] = useState(1);
    const [coords, setCoords] = useState({});
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
    const [selectedNewTags, setSelectedNewTags] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        axios.post(`${process.env.REACT_APP_API_URL}/search/nearby`, body, config)
            .then((response) => {
                console.log('response.data: ', response.data)
                setUserposts([...response.data])
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('Log In / Sign Up to access filters');
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
        axios.post(`${process.env.REACT_APP_API_URL}/search/nearby`, body, config)
            .then((response) => {
                console.log('response.data: ', response.data)
                setUserposts([...response.data])
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('Log In / Sign Up to access filters');
            });
    }

    const handleClearFilter = () => {
        setSelectedNewTags([])
        setRadius(1)
    }

    useEffect(() => {
        setLoading(true)
        enableLocation()

        const fetchFeed = async () => {
            console.log('accessToken: ', getAccessTokenFromContext())

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            axios.get(`${process.env.REACT_APP_API_URL}/user_post/explore/${lastFetched}`, config)
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
        }
        fetchFeed()

        setLoading(false)
    }, [getAccessTokenFromContext])

    const handleLoadMore = async () => {
        const fetchFeed = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            axios.get(`${process.env.REACT_APP_API_URL}/user_post/explore/${lastFetched}`, config)
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
            <Row>
                <div className='fixed-top'
                    style={{
                        display: 'flex', justifyContent: 'center',
                        position: 'fixed', width: '100%', gap: '2rem',
                        marginTop: window.innerWidth <= 800 ? '6rem' : '5rem',
                    }}>
                    <Button
                        onClick={handleShow}>
                        Add filter
                    </Button>
                    <Button
                        className='xs-1'
                        onClick={handleClearFilter}>
                        Clear filter
                    </Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Body>
                            <div>
                                <Form style={{ marginBottom: '2rem' }}>
                                    <div>
                                        <Form.Group>
                                            <Form.Label>
                                                Range
                                            </Form.Label>
                                            <RangeSlider
                                                value={radius}
                                                onChange={handleRange}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div>
                                        <Button
                                            className='xs'
                                            onClick={handleRangeFilter}>
                                            Add range filter
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                            <div>
                                <Form style={{ marginBottom: '2rem' }}>
                                    <div>
                                        <Form.Group className="mb-3" controlId="tags">
                                            <TagsInput
                                                value={selectedNewTags}
                                                onChange={setSelectedNewTags}
                                                name="tags"
                                                placeHolder="Enter tag"
                                            />
                                        </Form.Group>
                                    </div>
                                    <div>
                                        <Button
                                            className='xs-1'
                                            onClick={handleTagFilter}>
                                            Add tag filter
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Row>
            <Row style={{ marginTop: '8rem' }}>
                <Col>
                    <Row>
                        <main style={{ paddingRight: '0' }}>
                            <ul className='p-2'>
                                {userposts.map((post) => (
                                    <FeedItem
                                        key={post.postId}
                                        post={post} />
                                ))}
                            </ul>

                            {userposts.length !== 0
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
