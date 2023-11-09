import { createContext, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'))

    const setAccessTokenForContext = (token) => {
        setAccessToken(token)
        sessionStorage.setItem('accessToken', token, 1000);
    }

    const getAccessTokenFromContext = () => {
        return accessToken;
    }

    return <UserContext.Provider
        value={{
            setAccessTokenForContext,
            getAccessTokenFromContext,
        }}>
        {children}
    </UserContext.Provider>
}

export default UserContext
