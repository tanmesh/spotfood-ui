import React from 'react'
import Cat404 from '../assets/cat404.jpg'

function NoFound() {
    return (
        <>
            <div style={{
                marginTop: '7rem',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <img
                    width={window.innerWidth <= 800 ? '70%' : '20%'}
                    height={window.innerHeight <= 800 ? '100%' : '20%'}
                    src={Cat404}
                    alt='Page not found'
                />
            </div>
        </>
    )
}

export default NoFound
