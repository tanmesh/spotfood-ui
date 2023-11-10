import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Col, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import Spinner from '../shared/Loading'
import NoPost from '../components/NoPost'
import UserContext from '../context/user/UserContext';
import React, { useEffect, useState, useContext } from 'react'
import FeedItemForProfile from '../components/FeedItemForProfile';

function MyPost() {
    const { getAccessTokenFromContext } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [userposts, setUserposts] = useState([])
    const [lastFetched, setLastFetched] = useState(0)
    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        emailId: '',
        firstName: '',
        lastName: '',
        followingList: [],
        followersList: [],
        tagList: [],
        nickName: '',
        password: '',
    })

    useEffect(() => {
        setLoading(true)

        if (getAccessTokenFromContext()==='null') {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }

        const fetchProfile = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getAccessTokenFromContext(),
                },
            };

            axios.get('http://localhost:39114/user/profile', config)
                .then((response) => {
                    console.log('Response from http://localhost:39114/user/profile: ', response.data)
                    setProfile(response.data)
                    fetchFeed(response.data.emailId)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate('/sign-in')
                });
        }
        fetchProfile()

        const fetchFeed = async (emailId) => {
            try {
                console.log('accessToken: ', getAccessTokenFromContext())
                if (getAccessTokenFromContext() === 'null') {
                    console.log('accessToken is null')
                    navigate('/sign-in')
                    return;
                }

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': getAccessTokenFromContext(),
                    },
                };

                axios.get(`http://localhost:39114/user_post/get_user_posts?authorEmailId=${emailId}&lastFetched=-1`, config)
                    .then((response) => {
                        console.log('response.data: ', response.data)
                        setLastFetched(lastFetched + 2)
                        setUserposts(response.data)
                        setLoading(false)
                    })
                    .catch((error) => {
                        setLoading(false)
                        console.error("Error:", error);
                        if (userposts.length === 0) {
                            return;
                        }
                        toast.error('An unexpected error occurred. Please try again.');
                    });
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
                toast.error('An unexpected error occurred. Please try again.');
            }
        }        

        setLoading(false)
    }, [])

    const handleLoadMore = async () => {
        const fetchFeed = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getAccessTokenFromContext(),
                },
            };

            axios.get(`http://localhost:39114/user_post/get_user_posts?authorEmailId=${profile.emailId}&lastFetched=${lastFetched}`, config)
                .then((response) => {
                    setLastFetched(lastFetched + 2)
                    setUserposts((prevState) => [...prevState, ...response.data])
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('An unexpected error occurred. Please try again.');
                });
        }
        fetchFeed()
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <Row>
                <Navbar />
            </Row>
            <Row style={{ marginTop: '5rem' }}>
                <h3 style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>My Posts</h3>
            </Row>
            <Row style={{ marginTop: '2rem', marginLeft: '20rem', marginRight: '20rem' }}>
                <Col className='p-0 m-0'>
                    <Row className="m-0" style={{ marginTop: "7rem" }}>
                        <main>
                            <ul className='m-0 p-0'>
                                {userposts.map((post) => (
                                    <FeedItemForProfile
                                        key={post.postId}
                                        post={post}
                                        currentUserProfile={profile} />
                                ))}
                            </ul>

                            {userposts && userposts.length !== 0
                                ? (
                                    <div className="d-flex mt-3 justify-content-center">
                                        <Button
                                            variant="btn btn btn-outline-dark"
                                            onClick={handleLoadMore}>
                                            Load more
                                        </Button>
                                    </div>
                                )
                                : (
                                    <NoPost />
                                )}
                        </main>
                    </Row>
                </Col>
            </Row >
        </>
    )
}

export default MyPost
