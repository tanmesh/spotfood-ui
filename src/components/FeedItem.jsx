import { Heart, HeartFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import UserContext from '../context/user/UserContext';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import React, { useState, useContext, Profiler } from 'react'

function FeedItem({ post, currentUserProfile }) {
    const { getAccessTokenFromContext, getEmailIdFromContext } = useContext(UserContext);
    const [liked, setLiked] = useState(post.liked);
    const [likeCnt, setLikeCnt] = useState(post.upVotes);
    // eslint-disable-next-line
    const [displayButton, setDisplayFollowButton] = useState(currentUserProfile === null || post.authorEmailId !== currentUserProfile.emailId);
    const [profile, setProfile] = useState(currentUserProfile);
    const navigate = useNavigate()

    const handleLikeClick = (e) => {
        e.preventDefault()

        if (getAccessTokenFromContext() === 'null') {
            console.log('accessToken is null')
            toast.error('Need to Sign In / Log In');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };
        console.log('accessToken: ', getAccessTokenFromContext())
        console.log('PostId', post)
        if (liked) { // already liked, set dislike
            axios.post(`${process.env.REACT_APP_API_URL}/user_post/unlike?postId=${post.postId}`, '', config)
                .then((response) => {
                    console.log('Unlike response: ', response);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate('/sign-in')
                });
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/user_post/like?postId=${post.postId}`, '', config)
                .then((response) => {
                    console.log('Like response: ', response);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate('/sign-in')
                });
        }

        setLikeCnt((prevState) => {
            return liked ? prevState - 1 : prevState + 1;
        });

        setLiked((prevState) => {
            return !prevState;
        });
    };

    const followed = () => {
        return !profile || profile.followingList.includes(post.authorEmailId);
    }

    const handleFollow = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };

        if (followed()) {
            axios.post(`${process.env.REACT_APP_API_URL}/user/unfollow_user`, { "followingList": [post.authorEmailId] }, config)
                .then((response) => {
                    console.log('Unfollow response: ', response);
                    if (Profiler) {
                        setProfile((prevState) => {
                            const newFollowingList = prevState.followingList.filter((emailId) => {
                                return emailId !== post.authorEmailId;
                            });
                            return { ...prevState, followingList: newFollowingList };
                        })
                    }

                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Something went wrong, please try again later');
                });
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/user/follow_user`, { "followingList": [post.authorEmailId] }, config)
                .then((response) => {
                    console.log('Follow response: ', response);
                    if (profile) {
                        setProfile((prevState) => {
                            const newFollowingList = [...prevState.followingList, post.authorEmailId];
                            return { ...prevState, followingList: newFollowingList };
                        })
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Something went wrong, please try again later');
                });
        }
    }

    return (
        <div className='cardDiv d-flex justify-content-center'>
            <Card
                border="border-dark"
                className='card text-center'>
                <Card.Header className='p-0 m-0'>
                    <Card.Img
                        variant="top"
                        src={post.imgUrl}
                        className={liked ? "like-animated" : ""}
                        onDoubleClick={handleLikeClick} />
                </Card.Header>
                <Card.Body className='p-0 mt-1 mb-1'>
                    <div className='cardBodyDiv m-0'>
                        <p className='m-0'>
                            {!liked
                                ? <Heart color="black" size={20} className='m-1' />
                                : <HeartFill color="red" size={20} className='m-1' />}
                            {likeCnt}
                        </p>

                        <Stack direction="horizontal" gap={2}>
                            <p className='fw-bold m-0'>Tags: </p>
                            {post.tagList.map((tag, index) => (
                                <Badge key={index} bg="primary">#{tag}</Badge>
                            ))}
                        </Stack>
                    </div>
                    <div className="cardBodyDiv m-0">
                        <div>
                            <p className="m-0">
                                <strong>Restaurant:</strong> {post.locationName}
                            </p>
                        </div>
                        {post.distance !== 0 && (
                            <div>
                                <p className="m-0" style={{ color: 'green' }}>
                                    {post.distance} mile away
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="cardBodyDiv m-0">
                        <div>
                            <p className='m-0'>
                                <strong>Author: </strong> {post.authorName}
                            </p>
                        </div>
                        <div>
                            {displayButton && (
                                <Button
                                    variant='sm btn btn-outline-dark'
                                    onClick={handleFollow}>
                                    {followed() ? 'Unfollow' : 'Follow'}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default FeedItem
