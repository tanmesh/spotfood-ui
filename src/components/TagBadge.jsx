import Badge from 'react-bootstrap/Badge';
import React from 'react'

function TagBadge({ key, tag, isFollowed, handleTagClicked }) {
    const handleClicked = () => {
        handleTagClicked(tag, isFollowed);
    }

    return (
        <Badge
            pill
            key={key}
            bg={isFollowed ? "success" : "primary"}
            onClick={handleClicked}
            className='badge-effects'
        >
            #{tag}
        </Badge>
    )
}

export default TagBadge
