import { toast } from 'react-toastify'
import { Button, Form, Modal } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import { TagsInput } from "react-tag-input-component";
import UserPostsContext from '../context/userPosts/UserPostsContext'
import UserContext from '../context/user/UserContext'
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
    const [lastFetchedTags, setLastFetchedTags] = useState(0)
    const [lastFetchedNearby, setLastFetchedNearby] = useState(0)
    
    const [coords, setCoords] = useState({});
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);

    const [radius, setRadius] = useState(1);
    const [selectedNewTags, setSelectedNewTags] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [tagFilterActive, setTagFilterActive] = useState(false);
    const [rangeFilterActive, setRangeFilterActive] = useState(false);

    const handleRange = (e) => {
        const radius = e.target.value
        setRadius(radius)
        console.log('Range selected: ', radius)
    }

    const handleTagFilter = () => {
        if (tagFilterActive === false) {
            setUserPostsForContext([])
        }
        setTagFilterActive(true)

        console.log('selectedNewTags: ', selectedNewTags)
        const body = {
            "type": "TAG",
            "tag": selectedNewTags,
            "searchOn": "EXPLORE",
        }

        console.log('body: ', body)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };
        axios.post(`${process.env.REACT_APP_API_URL}/search/nearby/${lastFetchedTags}`, body, config)
            .then((response) => {
                console.log('response.data: ', response.data)
                if(response.data.length === 0) {
                    setThatsAll(true)
                    return;
                }
                setUserPostsForContext((prevState) => [...prevState, ...response.data])
                setLastFetchedTags(lastFetchedTags + 2)
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('An unexpected error occurred. Please try again.');
            });
    }

    const handleRangeFilter = () => {
        if (rangeFilterActive === false) {
            setUserPostsForContext([])
        }
        setRangeFilterActive(true)

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
            "searchOn": "EXPLORE",
        }

        console.log('body: ', body)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };
        axios.post(`${process.env.REACT_APP_API_URL}/search/nearby/${lastFetchedNearby}`, body, config)
            .then((response) => {
                console.log('response.data: ', response.data)
                if(response.data.length === 0) {
                    setThatsAll(true)
                    return;
                }
                setUserPostsForContext((prevState) => [...prevState, ...response.data])
                setLastFetchedNearby(lastFetchedNearby + 2)
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('An unexpected error occurred. Please try again.');
            });
    }

    const handleClearFilter = (e) => {
        e.preventDefault()
        setSelectedNewTags([])
        setRadius(1)
        
        setLastFetched(0)
        setLastFetchedTags(0)
        setLastFetchedNearby(0)

        setTagFilterActive(false)
        setRangeFilterActive(false)
        setLastFetched(0)
        window.location.reload();
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

    useEffect(() => {
        setUserPostsForContext([])
        setLoading(true)
        enableLocation()

        setProfileForContext(null)

        console.log('process.env.REACT_APP_API_URL: ', process.env.REACT_APP_API_URL)

        if (tagFilterActive === false && rangeFilterActive === false) {
            fetchFeed()
        }

        fetchProfile()

        setLoading(false)
    }, [])

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

    const handleLoadMore = async () => {
        if (tagFilterActive) {
            handleTagFilter()
        } else if (rangeFilterActive) {
            handleRangeFilter()
        } else {
            fetchFeed()
        }
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <main>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'fixed',
                        gap: '0.5rem',
                        zIndex: '1',
                        right: '30px',
                    }} >
                    <Button
                        size='sm'
                        onClick={handleShow}>
                        Add filter
                    </Button>
                    <Button
                        size='sm'
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
                                            onClick={handleRangeFilter}
                                            style={{ marginRight: '1rem' }}>
                                            Add range filter
                                        </Button>
                                        <Button
                                            className='xs'
                                            onClick={() => { setRadius(0) }}>
                                            Clear filter
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
                                            onClick={handleTagFilter}
                                            style={{ marginRight: '1rem' }}>
                                            Add tag filter
                                        </Button>
                                        <Button
                                            className='xs'
                                            onClick={() => { setSelectedNewTags([]) }}>
                                            Clear filter
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

                <ul className='p-2'>
                    {getUserPostsFromContext().map((post) => (
                        <FeedItem
                            key={post.postId}
                            post={post}
                        />
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
                                        alt='Thats all'
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
        </>
    )
}

export default Explore
