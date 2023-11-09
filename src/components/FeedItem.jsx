import { Heart, HeartFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import UserContext from '../context/user/UserContext';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify';

function FeedItem({ post, currentUserProfile }) {
    const { getAccessTokenFromContext } = useContext(UserContext);
    const [liked, setLiked] = useState(post.liked);
    const [likeCnt, setLikeCnt] = useState(post.upVotes);
    // eslint-disable-next-line
    const [displayButton, setDisplayFollowButton] = useState(currentUserProfile && post.authorEmailId !== currentUserProfile.emailId);
    const navigate = useNavigate()

    const handleLikeClick = (e) => {
        e.preventDefault()

        if (!getAccessTokenFromContext()) {
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
        console.log('accessToken: ', getAccessTokenFromContext())
        console.log('PostId', post)
        if (liked) { // already liked, set dislike
            axios.post(`http://localhost:39114/user_post/unlike?postId=${post.postId}`, '', config)
                .then((response) => {
                    console.log('Unlike response: ', response);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate('/sign-in')
                });
        } else {
            axios.post(`http://localhost:39114/user_post/like?postId=${post.postId}`, '', config)
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
        console.log('Following list: ', currentUserProfile.followingList);
        return currentUserProfile && currentUserProfile.followingList.includes(post.authorEmailId);
    }

    const handleFollow = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };

        if (followed()) {
            axios.post(`http://localhost:39114/user/unfollow_user`, { "emailId": post.authorEmailId }, config)
                .then((response) => {
                    console.log('Unfollow response: ', response);
                    // setProfile((prevState) => {
                    //     const newFollowingList = prevState.followingList.filter((emailId) => {
                    //         return emailId !== post.authorEmailId;
                    //     });
                    //     return { ...prevState, followingList: newFollowingList };
                    // })
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Something went wrong, please try again later');
                });
        } else {
            axios.post(`http://localhost:39114/user/follow_user`, { "emailId": post.authorEmailId }, config)
                .then((response) => {
                    console.log('Follow response: ', response);
                    // setProfile((prevState) => {
                    //     const newFollowingList = [...prevState.followingList, post.authorEmailId];
                    //     return { ...prevState, followingList: newFollowingList };
                    // })
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Something went wrong, please try again later');
                });
        }
    }

    return (
        <div className='cardDiv d-flex justify-content-end'>
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
