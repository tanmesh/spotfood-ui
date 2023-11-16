import { Heart, HeartFill, X } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import axios from 'axios'
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import React, { useContext, useState } from 'react'
import UserContext from '../context/user/UserContext';

function FeedItemForProfile({ post }) {
    const [display, setDisplay] = useState(true);
    const { getAccessTokenFromContext } = useContext(UserContext);

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

    if (display === false) {
        return <>
        </>
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
                    />
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
                </Card.Body>
            </Card>
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
        </div>
    )
}

export default FeedItemForProfile
