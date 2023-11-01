import { Heart, HeartFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import AuthContext from '../context/auth/AuthContext';
import React, { useState, useContext } from 'react'

// TODO: 1. on change of likeCnt, update the post in the database

function FeedItem({ post }) {
    const { getAccessTokenFromContext, setAccessTokenFromContext } = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    const [likeCnt, setLikeCnt] = useState(post.upVotes);
    const [accessToken, setAccessToken] = useState(getAccessTokenFromContext());
    const navigate = useNavigate()

    const handleLikeClick = (e) => {
        e.preventDefault()

        setAccessToken(getAccessTokenFromContext())

        console.log('accessToken: ', accessToken)

        if (accessToken === null) {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }

        setLikeCnt((prevState) => {
            return liked ? prevState - 1 : prevState + 1;
        });

        setLiked((prevState) => {
            return !prevState;
        });

        // const config = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-access-token': accessToken,
        //     },
        // };
        // axios.get(`http://localhost:39114/user_post/like?postId=${post.postId}`, config)
        //     .then((response) => {
        //         console.log(post.postId);
        //     })
        //     .catch((error) => {
        //         console.error("Error:", error);
        //         navigate('/sign-in')
        //     });
    };

    return (
        <div className='cardDiv'>
            <Card
                border="border-dark"
                className='card text-center'>
                <Card.Header className='p-0 m-0'>
                    <Card.Img
                        variant="top"
                        src={post.imageS3Path}
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
                            {post.tags.map((tag, index) => (
                                <Badge key={index} bg="primary">#{tag}</Badge>
                            ))}
                        </Stack>
                    </div>
                    <div>
                        <p className='m-0'><strong>Restaurant name:</strong> {post.locationName}</p>
                        <p className='m-0'><strong>Author emailId: </strong> {post.authorEmailId}</p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default FeedItem
