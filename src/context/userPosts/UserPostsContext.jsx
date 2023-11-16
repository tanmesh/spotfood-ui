import { createContext, useState } from "react";

const UserPostsContext = createContext()

export const UserPostsProvider = ({ children }) => {
    const [userposts, setUserposts] = useState([])
    const [profile, setProfile] = useState({
        emailId: '',
        firstName: '',
        lastName: '',
        followingList: [],
        followersList: [],
        tagList: [],
        nickName: '',
        password: '',
    })

    const setProfileForContext = (profile) => {
        setProfile((prevState) => {
            return {
                ...prevState,
                ...profile,
            }
        })
    }

    const getProfileFromContext = () => {
        return profile;
    }

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
            setProfileForContext,
            getProfileFromContext
        }}>
        {children}
    </UserPostsContext.Provider>
}

export default UserPostsContext
