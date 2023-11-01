import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import AuthContext from '../context/auth/AuthContext';
import React, { useState, useContext } from 'react'

/*
TODO: 
    1. fix the navbar so that it is always at the top of the page
*/
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
                        <Button onClick={() => navigate('/add-post')} variant="btn btn-outline-dark btn-sm">
                            Add new post
                        </Button>
                    </ButtonGroup>
                </li>

                <li>
                    <ButtonGroup>
                        <Button onClick={() => navigate('/about')} variant="btn btn-outline-dark btn-sm">
                            About
                        </Button>
                    </ButtonGroup>
                </li>

                <Dropdown>
                    <Dropdown.Toggle variant="light" size="sm" id="dropdown-basic" style={{ border: "transparent" }}>
                        <img
                            src="https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg"
                            alt="icon"
                            style={{
                                width: "50px",
                                borderRadius: "50%"
                            }}
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ul>
        </div >
    )
}

export default Navbar
