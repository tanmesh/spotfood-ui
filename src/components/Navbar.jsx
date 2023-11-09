import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap'
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import UserContext from '../context/user/UserContext';
import React, { useState, useContext } from 'react'
import Form from 'react-bootstrap/Form';

function Navbar() {
    const navigate = useNavigate()
    const { getAccessTokenFromContext, setAccessTokenForContext } = useContext(UserContext);
    // eslint-disable-next-line
    const [accessToken, setAccessToken] = useState(getAccessTokenFromContext());

    // Handling logout 
    const handleLogout = (e) => {
        console.log(accessToken);

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
            },
        };

        axios.post('http://localhost:39114/user/logout', '', config)
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
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className=" mr-sm-2"
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit">Submit</Button>
                    </Col>
                </Row>
            </Form>
            <ul className='navbarList p-0 mb-0'>
                <li>
                    <ButtonGroup>
                        <Button onClick={() => navigate('/')} variant="btn btn-outline-dark btn-sm">
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
                            variant="btn btn-outline-dark btn-sm">
                            Explore
                        </Button>
                    </ButtonGroup>
                </li>

                <li>
                    <ButtonGroup>
                        <Button
                            onClick={() => navigate('/add-post')}
                            variant="btn btn-outline-dark btn-sm">
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
                        variant="btn btn-outline-dark btn-sm">
                        My Profile
                    </Button>

                    <Dropdown.Toggle split variant="btn btn-outline-dark btn-sm" id="dropdown-split-basic" />

                    <Dropdown.Menu>
                        <Dropdown.Item
                            style={{ fontSize: '0.9rem', padding: '0.25rem 0.50rem' }}
                            variant="sm"
                            onClick={handleLogout}>Log out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ul>
        </div >
    )
}

export default Navbar
