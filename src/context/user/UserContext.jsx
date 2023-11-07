import { createContext, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'))
    const [profile, setProfile] = useState({})

    const setAccessTokenFromContext = (token) => {
        setAccessToken(token)
        sessionStorage.setItem('accessToken', token, 1000);
    }

    const getAccessTokenFromContext = () => {
        return accessToken;
    }

    const setProfileForContext = (profile) => {
        setProfile(profile)
    }

    const getProfileFromContext = () => {
        return profile;
    }

    return <UserContext.Provider
        value={{
            setAccessTokenFromContext,
            getAccessTokenFromContext,
            setProfileForContext,
            getProfileFromContext,
        }}>
        {children}
    </UserContext.Provider>
}

export default UserContext
