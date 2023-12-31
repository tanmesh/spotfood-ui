import { Heart, HeartFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Card, Stack, Badge, Carousel } from 'react-bootstrap';
import axios from 'axios'
import React, { useState, useContext } from 'react'
import UserContext from '../context/user/UserContext';
import UserPostsContext from '../context/userPosts/UserPostsContext';
import TagBadge from './TagBadge';

function FeedItem({ post }) {
    const { getAccessTokenFromContext } = useContext(UserContext);
    const { getProfileFromContext, setProfileForContext } = useContext(UserPostsContext);
    const [liked, setLiked] = useState(post.liked);
    const [likeCnt, setLikeCnt] = useState(post.upVotes);
    const displayButton = getProfileFromContext() === null || post.authorEmailId !== getProfileFromContext().emailId;
    const navigate = useNavigate()

    const isMobile = () => {
        return window.innerWidth <= 800;
    }

    const handleLikeClick = (e) => {
        e.preventDefault()

        if (getAccessTokenFromContext() === null) {
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
        return getProfileFromContext().followingList.includes(post.authorEmailId);
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

                    let updatedProfile = { ...getProfileFromContext() };
                    updatedProfile.followingList = updatedProfile.followingList.filter((emailId) => {
                        return emailId !== post.authorEmailId;
                    });
                    setProfileForContext(updatedProfile);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Something went wrong, please try again later');
                });
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/user/follow_user`, { "followingList": [post.authorEmailId] }, config)
                .then((response) => {
                    console.log('Follow response: ', response);

                    let updatedProfile = { ...getProfileFromContext() };
                    updatedProfile.followingList.push(post.authorEmailId);
                    setProfileForContext(updatedProfile);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Something went wrong, please try again later');
                });
        }
    }

    const handleTagClicked = (tag, isFollowed) => {
        console.log('Clicked tag: ', tag)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };

        if (isFollowed) {
            axios.post(`${process.env.REACT_APP_API_URL}/user/unfollow_tag`, { tagList: [tag] }, config)
                .then((response) => {
                    console.log('Response from /user/unfollow_tag: ', response.data)
                    let profile = getProfileFromContext();
                    profile.tagList = profile.tagList.filter((t) => {
                        return t !== tag;
                    });
                    setProfileForContext(profile);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Error removing tags!')
                    return;
                });
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/user/follow_tag`, { tagList: [tag] }, config)
                .then((response) => {
                    console.log('Response from /user/unfollow_tag: ', response.data)
                    let profile = getProfileFromContext();
                    profile.tagList.push(tag);
                    setProfileForContext(profile);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Error removing tags!')
                    return;
                });
        }
    }

    return (
        <div className='cardDiv d-flex justify-content-center'>
            <Card
                border="border-dark"
                className='card text-center'>
                <Card.Header className='p-0 m-0'>
                    {Array.isArray(post.imgUrl) ? (
                        <Carousel
                            interval={null} style={{ backgroundColor: 'black' }}
                            indicators={post.imgUrl.length === 1 ? false : true}
                            nextIcon={post.imgUrl.length !== 1 ? undefined : null}
                            prevIcon={post.imgUrl.length !== 1 ? undefined : null} >
                            {post.imgUrl.map((url, index) => (
                                <Carousel.Item key={index}>
                                    <div style={{ width: '100%', height: isMobile() ? '300px' : '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img
                                            src={url}
                                            alt={`Slide ${index}`}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            className={liked ? "like-animated" : ""}
                                            onDoubleClick={handleLikeClick}
                                        />
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <p>Invalid or missing image URLs for this post.</p>
                    )}
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
                                <TagBadge
                                    key={index}
                                    tag={tag}
                                    isFollowed={getProfileFromContext().tagList.includes(tag)}
                                    handleTagClicked={handleTagClicked}
                                />
                            ))}
                        </Stack>
                    </div>
                    <div className="cardBodyDiv m-0">
                        <div>
                            <p className="m-0">
                                <strong>Restaurant:</strong> <a onClick={() => navigate(`/restaurant/${post.restaurantId}`)}>{post.restaurantName}</a>
                            </p>
                        </div>
                        {post.distance >= 1 && (
                            <div>
                                <p className="m-0" style={{ color: 'green' }}>
                                    <b>{post.distance} mile away</b>
                                </p>
                            </div>
                        )}
                        {post.distance === 0 && (
                            <div>
                                <p className="m-0" style={{ color: 'green' }}>
                                    <b>Around you</b>
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
                                <Badge
                                    pill
                                    bg={followed() ? 'secondary' : 'dark'}
                                    onClick={handleFollow}
                                    className='badge-effects'
                                >
                                    {followed() ? 'Unfollow' : 'Follow'}
                                </Badge>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default FeedItem
