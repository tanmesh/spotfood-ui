import spinner from './spinner.gif'
import React from 'react'

function Loading() {
    return (
        <img src={spinner} alt="Loading..." style={{
            width: "100px",
            margin: "auto",
            display: "block"
        }} />
    )
}

export default Loading
