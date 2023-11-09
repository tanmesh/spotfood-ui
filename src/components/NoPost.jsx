import React from 'react'
import Card from 'react-bootstrap/Card';
import cat from '../assets/no-post-yet.jpg'

function NoPost() {
    return (
        <div className='cardDiv d-flex justify-content-end'>
            <Card
                border="border-dark"
                className='card text-center'>
                <Card.Header className='p-0 m-0'>
                    <Card.Img
                        variant="top"
                        src={cat}
                    />
                </Card.Header>
            </Card>
        </div>
    )
}

export default NoPost
