import { Heart, HeartFill, X } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import axios from 'axios'
import { Card, Stack, Carousel } from 'react-bootstrap';
import React, { useContext, useState } from 'react'
import UserContext from '../context/user/UserContext';
import UserPostsContext from '../context/userPosts/UserPostsContext';
import TagBadge from './TagBadge';

function FeedItemForProfile({ post }) {
    const [display, setDisplay] = useState(true);
    const { getAccessTokenFromContext } = useContext(UserContext);
    const { getProfileFromContext, setProfileForContext } = useContext(UserPostsContext);

    const [liked, setLiked] = useState(post.liked);

    const isMobile = () => {
        return window.innerWidth <= 800;
    }

    const handleRemovePost = (postId) => {
        setDisplay(false);

        console.log('Clicked to remove postId: ', postId)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };

        axios.post(`${process.env.REACT_APP_API_URL}/user_post/delete?postId=${post.postId}`, '', config)
            .then((response) => {
                console.log('Post deleted: ', response);
                toast.success('Successfully deleted the post.')
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('Failed to delete the post.')
            });
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

    if (display === false) {
        return <>
        </>
    }
    return (
        <div className='cardDiv d-flex justify-content-center position-relative'>
            <Card
                border="border-dark"
                className='card text-center position-relative'>
                <Card.Header className='p-0 m-0'>
                    {Array.isArray(post.imgUrl) ? (
                        <Carousel interval={null} style={{ backgroundColor: 'black' }}>
                            {post.imgUrl.map((url, index) => (
                                <Carousel.Item key={index}>
                                    <div style={{ width: '100%', height: isMobile() ? '300px' : '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img
                                            src={url}
                                            alt={`Slide ${index}`}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            className={liked ? "like-animated" : ""}
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
                            {!post.liked
                                ? <Heart color="black" size={20} className='m-1' />
                                : <HeartFill color="red" size={20} className='m-1' />}
                            {post.upVotes}
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
                                <strong>Restaurant:</strong> {post.locationName}
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
                    <div>
                        <X
                            onClick={() => { handleRemovePost(post.postId) }}
                            style={{
                                fontSize: '3rem',
                                color: 'red',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }} />
                    </div>
                </Card.Body>
                {/* <div className="position-absolute bottom-0 end-0 p-2">
                    <X
                        onClick={() => { handleRemovePost(post.postId) }}
                        style={{
                            fontSize: '3rem',
                            color: 'red',
                            cursor: 'pointer',
                            transition: 'transform 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }} />
                </div> */}
            </Card>
        </div>
    )
}

export default FeedItemForProfile
