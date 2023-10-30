import { createContext, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'))

    const setAccessTokenFromContext = (token) => {
        setAccessToken(token)
        sessionStorage.setItem('accessToken', token, 10*100);
    }

    const getAccessTokenFromContext = () => {
        return accessToken;
    }

    return <AuthContext.Provider
        value={{
            setAccessTokenFromContext,
            getAccessTokenFromContext,
        }}>
        {children}
    </AuthContext.Provider>
}

export default AuthContext
