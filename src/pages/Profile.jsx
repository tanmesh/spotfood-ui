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
import AuthContext from '../context/auth/AuthContext';
import React, { useEffect, useState, useContext } from 'react'

// TODO: set loading 

function Profile() {
    // eslint-disable-next-line
    const { getAccessTokenFromContext, setAccessTokenFromContext } = useContext(AuthContext);
    const [accessToken, setAccessToken] = useState(getAccessTokenFromContext());
    // eslint-disable-next-line
    const [firstName, setFirstName] = useState('');
    // eslint-disable-next-line
    const [lastName, setLastName] = useState('');
    // eslint-disable-next-line
    const [emailId, setEmail] = useState('');
    // eslint-disable-next-line
    const [password, setPassword] = useState('');
    const profilePicUrl = 'https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg'
    const [addTagInput, setAddTagInput] = useState(false)
    const [removeTagInput, setRemoveTagInput] = useState(false)
    const [displayTags, setDisplayTags] = useState([]);
    const [selectedNewTags, setSelectedNewTags] = useState([]);
    const [removeTags, setRemoveTags] = useState([]);
    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        emailId: '',
        firstName: '',
        lastName: '',
        followTagList: [],
        followersList: [],
        tagList: [],
        nickName: '',
        lastUpdatedLocation: '',
        password: '',
    })

    useEffect(() => {
        setAccessToken(getAccessTokenFromContext())

        console.log('accessToken: ', accessToken)

        if (accessToken === null) {
            console.log('accessToken is null')
            navigate('/sign-in')
            return;
        }

        const fetchProfile = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                },
            };

            axios.get('http://localhost:39114/user/profile', config)
                .then((response) => {
                    setProfile(response.data)
                    setDisplayTags(response.data.tagList)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate('/sign-in')
                });
        }
        fetchProfile()
    }, [navigate, getAccessTokenFromContext, accessToken])

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

    // TODO: handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const profileData = {
            emailId: profile.emailId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            followingList: profile.followingList,
            followersList: profile.followersList,
            tagList: selectedNewTags,
            nickName: profile.nickName,
            password: profile.password,
            latitude: profile.latitude,
            longitude: profile.longitude,
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
            },
        };

        console.log(profileData)
        axios.post('http://localhost:39114/user/edit', profileData, config)
            .then((response) => {
                console.log('Response from http://localhost:39114/user/edit: ', response.data)
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('Error updating profile!')
            });

        if (removeTagInput) {
            console.log('removeTags: ', removeTags)
            axios.post('http://localhost:39114/user/unfollow_tag', { tagList: removeTags }, config)
                .then((response) => {
                    console.log('Response from http://localhost:39114/user/unfollow_tag: ', response.data)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Error removing tags!')
                });
        }

        toast.success('Profile updated successfully!')

        setSelectedNewTags([])
        setRemoveTags([])
        setRemoveTagInput(false)
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

                {/* <div className='ml-2 mr-1 mt-2'>
                    <Stack direction="horizontal" gap={2} className='cardDiv'>
                        {profile.followTagList.map((tag) => (
                            <Badge bg="primary">{tag}</Badge>
                        ))}
                    </Stack>
                </div> */}

                <div className="profileInfo">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={profile.firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={profile.lastName}
                                onChange={(e) => setLastName(e.target.value)}
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
