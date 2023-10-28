import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import React, { useState } from 'react'

function FeedItem({ key, post }) {
    console.log(post)
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.upVotes);

    const handleLikeClick = (e) => {
        e.preventDefault()

        console.log("Double clicked")

        setLikes(likes + 1);

        console.log(likes)
    };

    return (
        <div className='cardDiv'>
            <Card
                border="border-dark"
                className='card text-center'>
                <Card.Header style={{ backgroundColor: 'white' }}>
                    <Card.Img
                        variant="top"
                        src={post.imageS3Path}
                        style={{
                            width: "50%",
                            borderRadius: "2%"
                        }}
                        className={liked ? "like-animated" : ""}
                        onDoubleClick={handleLikeClick} />
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Stack direction="horizontal" gap={2} className='cardDiv'>
                            <p className='fw-bold m-0'>Tags: </p>
                            {post.tags.map((tag) => (
                                <Badge bg="primary">{tag}</Badge>
                            ))}
                        </Stack>
                    </Card.Text>
                    <Card.Text>
                        
                        <p> <strong>Likes: </strong> {post.upVotes}</p>
                    </Card.Text>
                    <Card.Text>
                        <p><strong>Restaurant name:</strong> {post.locationName}</p>
                    </Card.Text>

                    <Card.Text>
                        <p><strong>Author emailId: </strong> {post.authorEmailId}</p>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default FeedItem
