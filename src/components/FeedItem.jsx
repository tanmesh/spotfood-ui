import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import React, { useState } from 'react'
import { Heart, HeartFill } from 'react-bootstrap-icons';

// TODO: 1. on change of likeCnt, update the post in the database

function FeedItem({ post }) {
    const [liked, setLiked] = useState(false);
    const [likeCnt, setLikeCnt] = useState(post.upVotes);

    const handleLikeClick = (e) => {
        e.preventDefault()

        console.log("Double clicked")

        setLikeCnt((prevState) => {
            return liked ? prevState - 1 : prevState + 1;
        });

        setLiked((prevState) => {
            return !prevState;
        });
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
                    <div className='cardBodyDiv'>
                        <p className='m-0'>
                            {!liked
                                ? <Heart color="black" size={20} />
                                : <HeartFill color="red" size={20} />}
                            {likeCnt}
                        </p>

                        <Stack direction="horizontal" gap={2}>
                            <p className='fw-bold m-0'>Tags: </p>
                            {post.tags.map((tag, index) => (
                                <Badge key={index} bg="primary">#{tag}</Badge>
                            ))}
                        </Stack>
                    </div>
                    <div>
                        <p><strong>Restaurant name:</strong> {post.locationName}</p>
                        <p><strong>Author emailId: </strong> {post.authorEmailId}</p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default FeedItem
