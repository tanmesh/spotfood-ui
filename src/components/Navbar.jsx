import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import AuthContext from '../context/auth/AuthContext';
import React, { useState, useContext } from 'react'
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap'

function Navbar() {
    const navigate = useNavigate()
    const { getAccessTokenFromContext, setAccessTokenFromContext } = useContext(AuthContext);
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
                setAccessTokenFromContext(null)
                toast.success('Logout successful!')
                navigate('/sign-in')
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('An unexpected error occurred. Please try again.');
            });
    };

    return (
        <div className='navbar mb-3 fixed-top'>
            <div className='title' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}> Spotfood </div>
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
                            Home
                        </Button>
                    </ButtonGroup>
                </li>

                <li>
                    <ButtonGroup>
                        <Button onClick={() => navigate('/explore')} variant="btn btn-outline-dark btn-sm">
                            Explore
                        </Button>
                    </ButtonGroup>
                </li>

                <li>
                    <ButtonGroup>
                        <Button onClick={() => navigate('/add-post')} variant="btn btn-outline-dark btn-sm">
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
                    <Button href="/profile" variant="btn btn-outline-dark btn-sm">My Profile</Button>

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
