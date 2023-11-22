import { useNavigate } from 'react-router-dom';
import { X, Plus } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { TagsInput } from "react-tag-input-component";
import axios from 'axios'
import { Badge, Stack, Button, Form } from 'react-bootstrap';
import UserContext from '../context/user/UserContext';
import Loading from '../shared/Loading';
import AWS from 'aws-sdk';
import React, { useEffect, useState, useContext } from 'react'

// TODO: set loading 

function Profile() {
    // eslint-disable-next-line
    const { getAccessTokenFromContext } = useContext(UserContext);
    const profilePicUrl = 'https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg'
    const [profileImgFile, setProfileImgFile] = useState(null)
    const [addTagInput, setAddTagInput] = useState(false)
    const [displayTags, setDisplayTags] = useState([]);
    const [selectedNewTags, setSelectedNewTags] = useState([]);
    const [loading, setLoading] = useState(true);

    const [displayFollowings, setDisplayFollowings] = useState([]);
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
        profilePicUrl: '',
    })

    useEffect(() => {
        setLoading(true)
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

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, config);
                console.log('Response from /user/profile: ', response.data);

                await setProfile(response.data);

                setDisplayTags(response.data.tagList);
                setDisplayFollowings(response.data.followingList);
                console.log(response.data.profilePicUrl);
                console.log('profile: ', profile)
                setLoading(false)
            } catch (error) {
                console.error('Error:', error);
                navigate('/sign-in');
            }
        }
        fetchProfile()
    }, [navigate, getAccessTokenFromContext, setProfile, setDisplayTags, setDisplayFollowings])

    const handleRemoveTag = (removeTag) => {
        setDisplayTags(prevDisplayTags => prevDisplayTags.filter(tag => tag !== removeTag))

        console.log('removeTag: ', removeTag)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };

        axios.post(`${process.env.REACT_APP_API_URL}/user/unfollow_tag`, { tagList: [removeTag] }, config)
            .then((response) => {
                console.log('Response from /user/unfollow_tag: ', response.data)
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('Error removing tags!')
                return;
            });
    }

    const handleRemoveFollowing = (removeFollowing) => {
        setDisplayFollowings(prevDisplayFollowings => prevDisplayFollowings.filter(following => following !== removeFollowing))

        console.log('removeFollowing: ', removeFollowing)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAccessTokenFromContext(),
            },
        };
        axios.post(`${process.env.REACT_APP_API_URL}/user/unfollow_user`, { followingList: [removeFollowing] }, config)
            .then((response) => {
                console.log('Response from /user/unfollow_user: ', response.data)
                toast.success('Successfully removed!')
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('Error removing tags!')
                return;
            });
    }

    const onMutate = (e) => {
        // Files
        if (e.target.files) {
            setProfileImgFile(e.target.files[0])
        } else {
            setProfile({
                ...profile,
                [e.target.id]: e.target.value,
            })
        }
    }

    // Upload to S3 bucket
    const uploadFile = async (imgFile) => {
        console.log('imgFile: ', imgFile)
        const S3_BUCKET = "spotfood-images/profilePic";
        const fileType = '.jpeg';
        const key = imgFile.name.split('.')[0] + fileType; // The key or filename for your object in S3

        console.log('process.env.REACT_APP_AWS_ACCESS_KEY: ', process.env.REACT_APP_AWS_ACCESS_KEY)
        console.log('process.env.REACT_APP_AWS_SECRET_KEY: ', process.env.REACT_APP_AWS_SECRET_KEY)
        console.log('REACT_APP_AWS_REGION:', process.env.REACT_APP_AWS_REGION)
        AWS.config.update({
            accessKeyId: `${process.env.REACT_APP_AWS_ACCESS_KEY}`,
            secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_KEY}`,
        });

        const s3 = new AWS.S3({
            params: { Bucket: S3_BUCKET },
            region: `${process.env.REACT_APP_AWS_REGION}`,
        });

        const params = {
            Bucket: S3_BUCKET,
            Key: key, // Use the same key as you defined earlier
            Body: imgFile,
        };

        try {
            const upload = s3.upload(params).promise();
            const data = await upload;

            if (data) {
                const url = data.Location; // The URL of the uploaded file
                console.log("File uploaded successfully.");
                console.log("File URL:", url);

                return url
            } else {
                console.error("Error uploading file. Data is undefined.");
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        const imgUrl = (await Promise.all([uploadFile(profileImgFile)]))[0]
        console.log(imgUrl)

        const profileData = {
            ...profile,
            tagList: selectedNewTags,
            profilePicUrl: imgUrl,
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

        console.log('Sending data: ', profileData)
        axios.post(`${process.env.REACT_APP_API_URL}/user/edit`, profileData, config)
            .then((response) => {
                console.log('Response from /user/edit: ', response.data)
                setDisplayTags(response.data.tagList)
                toast.success('Profile updated successfully!')
            })
            .catch((error) => {
                console.log(error)
                toast.error('Error updating profile!')
            });

        setSelectedNewTags([])

        setLoading(false)
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <main className='profile'>
                {/* TODO: add edit option itself on the img */}
                <img
                    src={profile.profilePicUrl ? profile.profilePicUrl : profilePicUrl}
                    alt="avatar"
                    style={{
                        width: "100px",
                        borderRadius: "50%",
                    }} />

                <div className="profileInfo">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label><b>First Name</b></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={profile.firstName}
                                onChange={onMutate}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label><b>Last Name</b></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={profile.lastName}
                                onChange={onMutate}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="emailId">
                            <Form.Label><b>Email address</b></Form.Label>
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
                            <Form.Label><b>Password</b></Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={profile.password}
                                // onChange={(e) => setPassword(e.target.value)}
                                disabled
                            />
                        </Form.Group>

                        {/* Tags */}
                        <>
                            <Form.Group className="mb-3" controlId="tags">
                                <Form.Label><b>Tags</b> </Form.Label>
                                <Stack direction="horizontal" gap={2} className='cardDiv'>
                                    {displayTags && displayTags.length > 0 &&
                                        displayTags.map((tag) => (
                                            <Badge
                                                pill
                                                bg="dark"
                                            >
                                                #{tag}
                                                <X
                                                    onClick={() => { handleRemoveTag(tag) }}
                                                    className='x-icon'
                                                />
                                            </Badge>
                                        ))
                                    }
                                    <Badge
                                        pill
                                        bg="dark"
                                    >
                                        {
                                            <Plus
                                                onClick={() => { setAddTagInput(true) }}
                                                className='plus-icon'
                                            />
                                        }
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
                            <Form.Label><b>Follower</b> </Form.Label>
                            <Stack direction="horizontal" gap={2} >
                                {profile.follower && profile.follower.length > 0
                                    ? profile.follower.map((user) => (
                                        <Badge
                                            pill
                                            bg="dark"
                                        >
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
                            <Form.Label><b>Following</b> </Form.Label>
                            <Stack direction="horizontal" gap={2}>
                                {displayFollowings && displayFollowings.length > 0
                                    ? (displayFollowings.map((user) => (
                                        <Badge
                                            pill
                                            bg="dark"
                                        >
                                            {user}
                                            <X
                                                onClick={() => { handleRemoveFollowing(user) }}
                                                className='icon-effects' />
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

                        {/* Avatar */}
                        <Form.Group controlId="avatar" className="mb-3">
                            <Form.Label><b>Upload new avatar</b></Form.Label>
                            <Form.Control
                                type="file"
                                onChange={onMutate} />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="btn btn-outline-dark" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </main>
        </>
    )
}

export default Profile
