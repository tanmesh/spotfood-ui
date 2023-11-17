import { useNavigate, useLocation } from "react-router-dom"
import { toast } from 'react-toastify';
import { Form, Dropdown, Button, ButtonGroup, ListGroup, Col, Row, Spinner, Modal } from 'react-bootstrap';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as HomeIcon } from '../assets/svg/homeIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import axios from 'axios'
import UserContext from '../context/user/UserContext';
import React, { useState, useContext } from 'react'

function Navbar() {
    const navigate = useNavigate()
    const { getAccessTokenFromContext, setAccessTokenForContext, setEmailIdForContext } = useContext(UserContext);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const [isSearchItemSelected, setIsSearchItemSelected] = useState(false);
    const location = useLocation();

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
                setEmailIdForContext(null)
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

    const isMobile = () => {
        return window.innerWidth <= 800;
    }

    return (
        <header className='navbar mb-sm-2 mb-lg-4 fixed-top p-2'>
            <div
                className='title'
                onClick={handleTitleClick}
                style={{ cursor: 'pointer' }}>
                Spotfood
            </div>
            <Form>
                <Row>
                    <Col xs="auto">
                        <Form.Group className="typeahead-form-group">
                            <Form.Control
                                type="text"
                                autoComplete="off"
                                onChange={handleInputChange}
                                value={searchItem}
                                style={{ width: isMobile() ? '150px' : '300px' }}
                                placeholder="Search for tags, restaurants, users..."
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
                    <Col className="d-flex align-items-end">
                        <Button
                            variant="btn btn-outline-dark btn-sm"
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
                <ul className='navbarList p-0 mb-0 me-0'>
                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/')}
                                variant={isActive('/') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}
                                className="button-icon-color-change">
                                <HomeIcon
                                    className="navbarIcon"
                                    fill={isActive('/') ? '#ffffff' : '#00000'}
                                    style={{ transition: 'fill 0.3s' }} />
                                {isMobile() ? '' : 'Home'}
                            </Button>
                        </ButtonGroup>
                    </li>

                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/explore')}
                                variant={isActive('/explore') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}
                                className="button-icon-color-change">
                                <ExploreIcon
                                    className="navbarIcon"
                                    fill={isActive('/explore') ? '#ffffff' : '#00000'}
                                    style={{ transition: 'fill 0.3s' }} />
                                {isMobile() ? '' : 'Explore'}
                            </Button>
                        </ButtonGroup>
                    </li>

                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/add-post')}
                                variant={isActive('/add-post') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}
                                className="button-icon-color-change">
                                <EditIcon
                                    className="navbarIcon"
                                    fill={isActive('/add-post') ? '#ffffff' : '#00000'}
                                    style={{ transition: 'fill 0.3s' }} />
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
        </header >
    )
}

export default Navbar
