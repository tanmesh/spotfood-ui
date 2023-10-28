import React, { useContext} from 'react'
import UserContext from '../context/user/UserContext'
import Navbar from '../components/Navbar'

function Home() {
    const { accessToken, setAccesstoken } = useContext(UserContext)

    return (
        <div>
            <Navbar />
        </div>
    )
}

export default Home
