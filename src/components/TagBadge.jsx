import Badge from 'react-bootstrap/Badge';
import React from 'react'

function TagBadge({ key, tag, isFollowed, handleTagClicked }) {
    const handleClicked = () => {
        handleTagClicked(tag, isFollowed);
    }

    return (
        <Badge
            key={key}
            bg={isFollowed ? "success" : "primary"}
            onClick={handleClicked}
            style={{
                transition: 'transform 0.3s',
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            #{tag}
        </Badge>
    )
}

export default TagBadge
