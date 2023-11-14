import { useNavigate, useLocation } from "react-router-dom"
import { toast } from 'react-toastify';
import { Form, Dropdown, Button, ButtonGroup, ListGroup, Col, Row, Spinner, Modal } from 'react-bootstrap';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as HomeIcon } from '../assets/svg/homeIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import { TagsInput } from "react-tag-input-component";
import axios from 'axios'
import RangeSlider from 'react-bootstrap-range-slider';
import UserContext from '../context/user/UserContext';
import UserPostsContext from '../context/userPosts/UserPostsContext';
import React, { useState, useContext } from 'react'

function Navbar({ coords, geolocationEnabled }) {
    const navigate = useNavigate()
    const { setUserPostsForContext } = useContext(UserPostsContext);
    const { getAccessTokenFromContext, setAccessTokenForContext } = useContext(UserContext);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const [isSearchItemSelected, setIsSearchItemSelected] = useState(false);
    const location = useLocation();

    const [radius, setRadius] = useState(1);
    const [selectedNewTags, setSelectedNewTags] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Handling logout 
    const handleLogout = () => {
        console.log(getAccessTokenFromContext());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };

        axios.post(`${process.env.REACT_APP_API_URL}/user/logout`, '', config)
            .then((response) => {
                console.log(response.data);
                setAccessTokenForContext(null)
                toast.success('Logout successful!')
                navigate('/sign-in')
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('An unexpected error occurred. Please try again.');
            });
    };

    const handleTitleClick = () => {
        console.log('getAccessTokenFromContext: ', getAccessTokenFromContext())
        if (getAccessTokenFromContext() === 'null') {
            navigate('/explore')
        } else {
            navigate('/')
        }

    }

    const isActive = (path) => {
        return path === location.pathname;
    }

    const autocompleteResult = (keyword) => {
        return new Promise((res, rej) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getAccessTokenFromContext(),
                },
            };

            axios.get(`${process.env.REACT_APP_API_URL}/tag/autocomplete/${keyword}`, config)
                .then((response) => {
                    res(response.data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('An unexpected error occurred. Please try again.');
                });
        });
    };

    const handleInputChange = (e) => {
        const searchItemValue = e.target.value;
        setSearchItem(searchItemValue);
        setIsSearchItemSelected(false);
        setResults([]);

        if (searchItemValue.length > 1) {
            setIsLoading(true);
            autocompleteResult(searchItemValue)
                .then((res) => {
                    setResults(res);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    };

    const onSearchItemSelected = (selectedSearchItem) => {
        setSearchItem(selectedSearchItem);
        setIsSearchItemSelected(true);
        setResults([]);
    };

    const handleSubmit = (e) => {
        console.log('searchItem: ', searchItem)
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

    const isMobile = () => {
        return window.innerWidth <= 800;
    }

    return (
        <div className='navbar mb-3 fixed-top'>
            <div
                className='title'
                onClick={handleTitleClick}
                style={{ cursor: 'pointer' }}>
                Spotfood
            </div>
            <Form inline>
                <Row>
                    <Col xs="auto">
                        <Form.Group className="typeahead-form-group">
                            <Form.Control
                                type="text"
                                autoComplete="off"
                                onChange={handleInputChange}
                                value={searchItem}
                                placeHolder="Search for tags, restaurants, users..."
                                style={{ width: isMobile() ? '150px' : '300px' }}
                            />
                            <ListGroup className="typeahead-list-group">
                                {!isSearchItemSelected &&
                                    results.length > 0 &&
                                    results.map((result) => (
                                        <ListGroup.Item
                                            key={result}
                                            className="typeahead-list-group-item"
                                            onClick={() => onSearchItemSelected(result)}>
                                            {result}
                                        </ListGroup.Item>
                                    ))}
                                {!results.length && isLoading && (
                                    <div className="typeahead-spinner-container">
                                        <Spinner animation="border" />
                                    </div>
                                )}
                            </ListGroup>
                        </Form.Group>
                    </Col>
                    <Col xs="auto m-0">
                        <Button
                            variant="btn btn-outline-dark sm"

                            onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            <div
                style={{
                    marginTop: '0.5rem',
                }}>
                {/* display: 'flex',
                    justifyContent: 'end',
                    width: '100%', */}
                <ul className='navbarList p-0 mb-0 me-0'>
                    {(isActive('/') || isActive('/explore')) && (
                        <li>
                            <Button
                                variant="btn btn-outline-primary btn-sm"
                                style={{ padding: isMobile() ? '0.22rem' : '0.5rem' }}
                                onClick={handleShow}>
                                Add filter
                            </Button>
                        </li>
                    )}
                    {(isActive('/') || isActive('/explore')) && (
                        <li>
                            <Button
                                variant="btn btn-outline-primary btn-sm"
                                style={{ padding: isMobile() ? '0.22rem' : '0.5rem' }}
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
                                                    className='sm'
                                                    onClick={handleRangeFilter}
                                                    style={{ marginRight: '1rem' }}>
                                                    Add range filter
                                                </Button>
                                                <Button
                                                    className='sm'
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
                        </li>
                    )}
                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/')}
                                variant={isActive('/') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}>
                                <HomeIcon fill={isActive('/') ? '#ffffff' : '#00000'} />
                                {isMobile() ? '' : 'Home'}
                            </Button>
                        </ButtonGroup>
                    </li>

                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/explore')}
                                variant={isActive('/explore') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}>
                                <ExploreIcon fill={isActive('/explore') ? '#ffffff' : '#00000'} />
                                {isMobile() ? '' : 'Explore'}
                            </Button>
                        </ButtonGroup>
                    </li>

                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/add-post')}
                                variant={isActive('/add-post') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}>
                                <EditIcon fill={isActive('/add-post') ? '#ffffff' : '#00000'} />
                                {isMobile() ? '' : 'Add new post'}
                            </Button>
                        </ButtonGroup>
                    </li>

                    {/* <li>
                    <ButtonGroup>
                        <Button onClick={() => navigate('/about')} variant="btn btn-outline-dark btn-sm">
                            About
                        </Button>
                    </ButtonGroup>
                </li> */}

                    <Dropdown as={ButtonGroup}>
                        <Button
                            href="/profile"
                            variant={isActive('/profile') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}>
                            My Profile
                        </Button>

                        <Dropdown.Toggle
                            split
                            variant={isActive('/profile') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}
                            id="dropdown-split-basic" />

                        <Dropdown.Menu>
                            <Dropdown.Item
                                style={{ fontSize: '0.9rem', padding: '0.25rem 0.50rem' }}
                                variant="sm"
                                onClick={() => navigate('/my-posts')}>My posts</Dropdown.Item>
                            <Dropdown.Item
                                style={{ fontSize: '0.9rem', padding: '0.25rem 0.50rem' }}
                                variant="sm"
                                onClick={handleLogout}>Log out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </ul>
            </div>
        </div >
    )
}

export default Navbar
