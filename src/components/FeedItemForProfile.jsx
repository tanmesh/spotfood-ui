import { Heart, HeartFill } from 'react-bootstrap-icons';
import UserContext from '../context/user/UserContext';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify';
import { X } from 'react-bootstrap-icons';

function FeedItemForProfile({ post }) {
    const [liked, setLiked] = useState(post.liked);
    const [likeCnt, setLikeCnt] = useState(post.upVotes);

    const handleRemovePost = (postId) => {
        console.log('Clicked to remove postId: ', postId)
        toast.success('This feature is intentially disabled!')
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
                </Card.Body>
            </Card>
            <div>
                <X
                    onClick={() => { handleRemovePost(post.postId) }}
                    style={{
                        fontSize: '3rem', // Adjust the size to your preference
                        color: 'red', // Change the color to red
                        cursor: 'pointer',
                        transition: 'transform 0.3s', // Add transition for the icon
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.3)'; // Scale up on hover
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'; // Return to the original size on hover out
                    }} />
            </div>
        </div>
    )
}

export default FeedItemForProfile
