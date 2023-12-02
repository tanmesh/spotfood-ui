import { useNavigate, useLocation } from "react-router-dom"
import { toast } from 'react-toastify';
import { Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios'
import UserContext from '../context/user/UserContext';
import UserPostsContext from '../context/userPosts/UserPostsContext'
import React, { useState, useContext } from 'react'
import { FaPlus, FaHome, FaCompass } from 'react-icons/fa'

function Navbar() {
    const navigate = useNavigate()
    const { getAccessTokenFromContext, setAccessTokenForContext, setEmailIdForContext } = useContext(UserContext);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const [isSearchItemSelected, setIsSearchItemSelected] = useState(false);
    const location = useLocation();

    const { setUserPostsForContext } = useContext(UserPostsContext);
    const [lastFetchedTags, setLastFetchedTags] = useState(0)
    const [thatsAll, setThatsAll] = useState(false);

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
        if (getAccessTokenFromContext() === null) {
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

    const handleTagFilter = () => {
        const body = {
            "type": "TAG",
            "tag": [searchItem],
            "searchOn": "FEED",
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
                if (response.data.length === 0) {
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

    const onSearchItemSelected = (selectedSearchItem) => {
        setSearchItem(selectedSearchItem);
        setIsSearchItemSelected(true);
        handleTagFilter()
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
                                <FaHome
                                    className="navbarIcon"
                                    fill={isActive('/') ? '#ffffff' : '#00000'}
                                    style={{ transition: 'fill 0.3s' }} />
                                {isMobile() ? '' : ' Home'}
                            </Button>
                        </ButtonGroup>
                    </li>

                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/explore')}
                                variant={isActive('/explore') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}
                                className="button-icon-color-change">
                                <FaCompass
                                    className="navbarIcon"
                                    fill={isActive('/explore') ? '#ffffff' : '#00000'}
                                    style={{ transition: 'fill 0.3s' }} />
                                {isMobile() ? '' : ' Explore'}
                            </Button>
                        </ButtonGroup>
                    </li>

                    <li>
                        <ButtonGroup>
                            <Button
                                onClick={() => navigate('/add-post')}
                                variant={isActive('/add-post') ? "dark btn-sm" : "btn btn-outline-dark btn-sm"}
                                className="button-icon-color-change">
                                <FaPlus
                                    className="navbarIcon"
                                    fill={isActive('/add-post') ? '#ffffff' : '#00000'}
                                    style={{ transition: 'fill 0.3s' }} />

                                {isMobile() ? '' : ' Add new post'}
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
