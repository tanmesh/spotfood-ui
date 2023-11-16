import React, { createContext, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'))
    const [emailId, setEmailId] = useState(sessionStorage.getItem('emailId'))

    const setAccessTokenForContext = (token) => {
        setAccessToken(token)
        sessionStorage.setItem('accessToken', token, 1000);
    }

    const getAccessTokenFromContext = () => {
        return accessToken;
    }

    const setEmailIdForContext = (emailId) => {
        setEmailId(emailId)
        sessionStorage.setItem('emailId', emailId, 1000);
    }

    const getEmailIdFromContext = () => {
        return emailId;
    }

    return <UserContext.Provider
        value={{
            setAccessTokenForContext,
            getAccessTokenFromContext,
            setEmailIdForContext,
            getEmailIdFromContext
        }}>
        {children}
    </UserContext.Provider>
}

export default UserContext
