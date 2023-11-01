// import { createContext, useState, useContext } from "react";
// import axios from 'axios'
// import AuthContext from '../auth/AuthContext';
// import React from 'react'

// const UserContext = createContext()

// export const UserProvider = ({ children }) => {
//     const { getAccessTokenFromContext, setAccessTokenFromContext } = useContext(AuthContext);
//     const [accessToken, setAccessToken] = useState(getAccessTokenFromContext())
//     const [profile, setProfile] = useState({})

//     const getProfileFromContext = () => {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-access-token': accessToken,
//             },
//         };

//         axios.get(`http://localhost:39114/user/profile`, config)
//             .then((response) => {
//                 console.log(response.data);
//             })
//             .catch((error) => {
//                 console.error("Error:", error);
//             });

//         setProfile(profile)
//         return profile
//     }

//     return <UserContext.Provider
//         value={{
//             getProfileFromContext,
//         }}>
//         {children}
//     </UserContext.Provider>
// }

// export default UserContext