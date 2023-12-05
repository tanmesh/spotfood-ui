import React, { createContext, useState } from "react";

const TagContext = createContext()

export const TagProvider = ({ children }) => {
    const [tags, setTags] = useState(sessionStorage.getItem('tags'))

    const setTagsForContext = (tags) => {
        const options = []
        tags.map((tag) => {
            options.push({ value: tag.name, label: tag.name })
        })
        setTags(options)
        sessionStorage.setItem('tags', JSON.stringify(options), 1000);
    }

    const getTagsFromContext = () => {
        return tags;
    }

    return <TagContext.Provider
        value={{
            setTagsForContext,
            getTagsFromContext,
        }}>
        {children}
    </TagContext.Provider>
}

export default TagContext
