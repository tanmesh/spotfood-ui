import React, { createContext, useState } from "react";

const UserPostsContext = createContext()

export const UserPostsProvider = ({ children }) => {
    const [feed, setFeed] = useState([])
    const [explore, setExplore] = useState([])
    const [profile, setProfile] = useState({
        emailId: '',
        firstName: '',
        lastName: '',
        followingList: [],
        followersList: [],
        tagList: [],
        nickName: '',
        password: '',
        restaurantName: '',
        restaurantId: ''
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

    const setUserFeedForContext = (feed) => {
        setFeed(feed)
    }

    const getUserFeedFromContext = () => {
        return feed;
    }

    const setUserExploreForContext = (explore) => {
        setExplore(explore)
    }

    const getUserExploreFromContext = () => {
        return explore;
    }

    return <UserPostsContext.Provider
        value={{
            setUserFeedForContext,
            getUserFeedFromContext,
            setUserExploreForContext,
            getUserExploreFromContext,
            setProfileForContext,
            getProfileFromContext
        }}>
        {children}
    </UserPostsContext.Provider>
}

export default UserPostsContext
