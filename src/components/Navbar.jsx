import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import ProfilePic from '../shared/ProfilePic'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function Navbar() {
    const navigate = useNavigate()

    return (
        <div className='navbar mb-3'>
            <div className='title' onClick={() => navigate('/')}> <a>Spotfood</a> </div>
            <ul className='navbarList'>
                <li>
                    <ButtonGroup>
                        <Button onClick={() => navigate('/')} variant="btn btn-outline-dark">
                            Home
                        </Button>
                    </ButtonGroup>
                </li>

                <li>
                    <ButtonGroup>
                        <Button onClick={() => navigate('/add-post')} variant="btn btn-outline-dark">
                            Add new post
                        </Button>
                    </ButtonGroup>
                </li>

                <li>
                    <ButtonGroup>
                        <Button onClick={() => navigate('/about')} variant="btn btn-outline-dark">
                            About
                        </Button>
                    </ButtonGroup>
                </li>

                <li><Link to='/profile'><ProfilePic /></Link></li>
            </ul>
        </div >

    )
}

export default Navbar
