import { Button, Form, Modal, Spinner, ListGroup } from 'react-bootstrap'
import { TagsInput } from "react-tag-input-component";
import { useState, useContext } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios'
import React from 'react'
import RangeSlider from 'react-bootstrap-range-slider';
import UserContext from '../context/user/UserContext'
import UserPostsContext from '../context/userPosts/UserPostsContext'

function Filter({ coords, geolocationEnabled }) {
    const { getAccessTokenFromContext } = useContext(UserContext);
    const { setUserPostsForContext } = useContext(UserPostsContext);
    const [radius, setRadius] = useState(1);
    const [selectedNewTags, setSelectedNewTags] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                setUserPostsForContext([...response.data])
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
        axios.post(`${process.env.REACT_APP_API_URL}/search/nearby`, body, config)
            .then((response) => {
                console.log('response.data: ', response.data)
                setUserPostsForContext([...response.data])
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

        window.location.reload();
    }

    return (
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
    )
}

export default Filter
