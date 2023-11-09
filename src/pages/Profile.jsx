import { useNavigate } from 'react-router-dom';
import { X, Plus } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { TagsInput } from "react-tag-input-component";
import axios from 'axios'
import Navbar from '../components/Navbar'
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserContext from '../context/user/UserContext';
import React, { useEffect, useState, useContext } from 'react'

// TODO: set loading 

function Profile() {
    // eslint-disable-next-line
    const { getAccessTokenFromContext } = useContext(UserContext);
    const profilePicUrl = 'https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg'

    const [addTagInput, setAddTagInput] = useState(false)
    const [removeTagInput, setRemoveTagInput] = useState(false)
    const [displayTags, setDisplayTags] = useState([]);
    const [selectedNewTags, setSelectedNewTags] = useState([]);
    const [removeTags, setRemoveTags] = useState([]);

    const [displayFollowings, setDisplayFollowings] = useState([]);
    const [removeFollowingInput, setRemoveFollowingInput] = useState(false)
    const [removeFollowings, setRemoveFollowings] = useState([]);
    const navigate = useNavigate()

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

    useEffect(() => {
        console.log('accessToken: ', getAccessTokenFromContext())

        if (getAccessTokenFromContext() === null) {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }

        const fetchProfile = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getAccessTokenFromContext(),
                },
            };

            axios.get('http://localhost:39114/user/profile', config)
                .then((response) => {
                    console.log('Response from http://localhost:39114/user/profile: ', response.data)
                    setProfile(response.data)
                    setDisplayTags(response.data.tagList)
                    setDisplayFollowings(response.data.followingList)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate('/sign-in')
                });
        }
        fetchProfile()
    }, [navigate, getAccessTokenFromContext])

    const handleRemoveTag = (removeTag) => {
        setRemoveTagInput(true)
        setDisplayTags(prevDisplayTags => prevDisplayTags.filter(tag => tag !== removeTag))

        console.log('removeTag: ', removeTag)
        console.log('removeTags: ', removeTags)

        const removeTagsCopy = [
            ...removeTags,
            removeTag,
        ]

        console.log('removeTagsCopy: ', removeTagsCopy)
        setRemoveTags(removeTagsCopy)
    }

    const handleRemoveFollowing = (removeFollowing) => {
        setRemoveFollowingInput(true)
        setDisplayFollowings(prevDisplayFollowings => prevDisplayFollowings.filter(following => following !== removeFollowing))

        console.log('removeFollowing: ', removeFollowing)

        const removeFollowingsCopy = [
            ...removeFollowings,
            removeFollowing,
        ]

        console.log('removeFollowingsCopy: ', removeFollowingsCopy)
        setRemoveFollowings(removeFollowingsCopy)
    }

    const onMutate = (e) => {
        setProfile({
            ...profile,
            [e.target.id]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const profileData = {
            ...profile,
            tagList: selectedNewTags,
        }
        for (const key in profileData) {
            if (profileData[key] === null) {
                delete profileData[key];
            }
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };

        if (removeTagInput) {
            console.log('removeTags: ', removeTags)
            axios.post('http://localhost:39114/user/unfollow_tag', { tagList: removeTags }, config)
                .then((response) => {
                    console.log('Response from http://localhost:39114/user/unfollow_tag: ', response.data)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Error removing tags!')
                    return;
                });
        }

        if (removeFollowingInput) {
            console.log('removeTags: ', removeFollowings)
            axios.post('http://localhost:39114/user/unfollow_user', { followingsList: removeFollowings }, config)
                .then((response) => {
                    console.log('Response from http://localhost:39114/user/unfollow_user: ', response.data)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Error removing tags!')
                    return;
                });
        }

        console.log(profileData)
        axios.post('http://localhost:39114/user/edit', profileData, config)
            .then((response) => {
                console.log('Response from http://localhost:39114/user/edit: ', response.data)
                setDisplayTags(response.data.tagList)
                toast.success('Profile updated successfully!')
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('Error updating profile!')
            });

        setSelectedNewTags([])
        setRemoveTags([])
        setRemoveTagInput(false)

        setRemoveFollowings([])
        setRemoveFollowingInput(false)
    };

    return (
        <div>
            <Navbar />
            <main className='profile'>
                {/* TODO: add edit option itself on the img */}
                <img src={profilePicUrl} alt="avatar" style={{
                    width: "100px",
                    borderRadius: "50%",
                }} />

                <div className="profileInfo">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={profile.firstName}
                                onChange={onMutate}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={profile.lastName}
                                onChange={onMutate}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="emailId">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter emailId"
                                value={profile.emailId}
                                // onChange={(e) => setEmail(e.target.value)}
                                disabled
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text" // TODO: type="password"
                                placeholder="Password"
                                value={profile.password}
                                // onChange={(e) => setPassword(e.target.value)}
                                disabled
                            />
                        </Form.Group>

                        {/* Tags */}
                        <>
                            <Form.Group className="mb-3" controlId="tags">
                                <Form.Label>Tags </Form.Label>
                                <Stack direction="horizontal" gap={2} className='cardDiv'>
                                    {displayTags && displayTags.length > 0 &&
                                        displayTags.map((tag) => (
                                            <Badge bg="primary">
                                                #{tag}
                                                <X
                                                    onClick={() => { handleRemoveTag(tag) }}
                                                    style={{
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.3s', // Add transition for the icon
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.3)'; // Scale up on hover
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)'; // Return to the original size on hover out
                                                    }} />
                                            </Badge>
                                        ))}
                                    <Badge bg="primary">
                                        {<Plus
                                            onClick={() => { setAddTagInput(true) }} // TODO: add tag
                                            style={{
                                                cursor: 'pointer',
                                                transition: 'transform 0.3s', // Add transition for the icon
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.3)'; // Scale up on hover
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)'; // Return to the original size on hover out
                                            }} />}
                                    </Badge>
                                </Stack>
                            </Form.Group>
                            {addTagInput &&
                                <Form.Group className="mb-3" controlId="tags">
                                    <TagsInput
                                        value={selectedNewTags}
                                        onChange={setSelectedNewTags}
                                        name="tags"
                                        placeHolder="Enter tag"
                                    />
                                </Form.Group>
                            }
                        </>

                        {/* Follower */}
                        <Form.Group className="mb-3" controlId="tags">
                            <Form.Label>Follower </Form.Label>
                            <Stack direction="horizontal" gap={2} >
                                {profile.follower && profile.follower.length > 0
                                    ? profile.follower.map((user) => (
                                        <Badge bg="primary">
                                            {user}
                                        </Badge>
                                    ))
                                    : (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                                            <p><i style={{ color: 'red', fontSize: '16px' }}>No one is following you yet {' '}</i>😩</p>
                                        </div>
                                    )
                                }
                            </Stack>
                        </Form.Group>

                        {/* Following */}
                        <Form.Group className="mb-3" controlId="tags">
                            <Form.Label>Following </Form.Label>
                            <Stack direction="horizontal" gap={2}>
                                {displayFollowings && displayFollowings.length > 0
                                    ? (displayFollowings.map((user) => (
                                        <Badge bg="primary">
                                            {user}
                                            <X
                                                onClick={() => { handleRemoveFollowing(user) }}
                                                style={{
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.3s', // Add transition for the icon
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.3)'; // Scale up on hover
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)'; // Return to the original size on hover out
                                                }} />
                                        </Badge>
                                    )))
                                    : (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <p><i style={{ color: 'red', fontSize: '16px' }}>You are not following anyone yet {' '}</i>😩</p>
                                        </div>
                                    )
                                }
                            </Stack>
                        </Form.Group>

                        <Form.Group controlId="avatar" className="mb-3">
                            <Form.Label>Upload new avatar</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="btn btn-outline-dark" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </main>
        </div>
    )
}

export default Profile
