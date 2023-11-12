import { useNavigate, useLocation } from "react-router-dom"
import { toast } from 'react-toastify';
import { Col, Row, Spinner } from 'react-bootstrap'
import axios from 'axios'
import { Form, Dropdown, Button, ButtonGroup, ListGroup } from 'react-bootstrap';
import UserContext from '../context/user/UserContext';
import React, { useState, useContext } from 'react'

function Navbar() {
    const navigate = useNavigate()
    const { getAccessTokenFromContext, setAccessTokenForContext } = useContext(UserContext);
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
                                style={{ width: window.innerWidth <= 800 ? '150px' : '300px' }}
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
                            variant="btn btn-outline-dark"
                            type="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            <div style={{marginTop: '0.5rem'}}>
                <ul className='navbarList p-0 mb-0'>
                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/')}
                                variant={isActive('/') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}>
                                <div>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-house-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
                                    <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
                                </svg>
                                {' '} */}
                                    Home
                                </div>
                            </Button>
                        </ButtonGroup>
                    </li>

                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/explore')}
                                variant={isActive('/explore') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}>
                                Explore
                            </Button>
                        </ButtonGroup>
                    </li>

                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/add-post')}
                                variant={isActive('/add-post') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}>
                                Add new post
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
