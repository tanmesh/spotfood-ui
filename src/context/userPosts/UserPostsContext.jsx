import { createContext, useState } from "react";

const UserPostsContext = createContext()

export const UserPostsProvider = ({ children }) => {
    const [userposts, setUserposts] = useState([])

    const setUserPostsForContext = (userPosts) => {
        setUserposts(userPosts)
    }

    const getUserPostsFromContext = () => {
        return userposts;
    }

    return <UserPostsContext.Provider
        value={{
            setUserPostsForContext,
            getUserPostsFromContext,
        }}>
        {children}
    </UserPostsContext.Provider>
}

export default UserPostsContext
