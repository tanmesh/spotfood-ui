import spinner from '../assets/spinner.gif'
import React from 'react'

/*
    TODO:
    1. center loading gif position
*/
function Loading() {
    return (
        <img
            src={spinner}
            alt="Loading..."
            style={{
                width: "50%",
                display: "block",
                
            }}
        />
    )
}

export default Loading
