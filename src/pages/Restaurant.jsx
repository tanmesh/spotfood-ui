import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserContext from '../context/user/UserContext';
import { FaPhoneAlt, FaStar, FaStarHalfAlt, FaHome } from 'react-icons/fa';
import { Carousel } from 'react-bootstrap';
import Map from '../components/Map';
import Loading from '../shared/Loading';

function Restaurant() {
    const [restaurant, setRestaurant] = useState([])
    const { getAccessTokenFromContext } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const params = useParams();

    useEffect(() => {
        const fetchRestaurants = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': getAccessTokenFromContext(),
                },
            };

            setLoading(true);
            axios.get(`${process.env.REACT_APP_API_URL}/restaurant/get/${params.restaurantId}`, config)
                .then((response) => {
                    console.log(response.data);
                    setRestaurant(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error('Something went wrong, please try again later');
                    setLoading(false);
                });
        }

        fetchRestaurants();
    }, [params.restaurantId, getAccessTokenFromContext])

    const isMobile = () => {
        return window.innerWidth <= 800;
    }

    const renderStars = () => {
        const rating = restaurant.rating;
        const totalStars = 5;
        const stars = [];
        const decimal = rating - Math.floor(rating);

        for (let i = 0; i < totalStars; i++) {
            if (i < Math.floor(rating)) {
                stars.push(<FaStar key={i} color="#ffc107" />);
            } else if (i === Math.floor(rating) && decimal >= 0.5) {
                stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
            } else {
                stars.push(<FaStar key={i} color="#e4e5e9" />);
            }
        }
        return stars;
    };

    const handleMapNavigation = () => {
        // Construct the Google Maps URL using the restaurant address
        const mapsUrl = `https://www.google.com/maps/place/${encodeURIComponent(restaurant.address)}`;

        // Navigate to the Google Maps URL
        window.open(mapsUrl, '_blank');
    };

    if (loading || !restaurant.latitude || !restaurant.longitude) {
        return <Loading />
    }

    return (
        <main className='profile'>
            <div style={{ width: '100%' }}>
                {restaurant.imgUrls === null || restaurant.imgUrls === undefined || restaurant.imgUrls.length === 0
                    ? null
                    :
                    <Carousel
                        indicators={restaurant.imgUrls.length === 1 ? false : true}
                        nextIcon={restaurant.imgUrls.length !== 1 ? undefined : null}
                        prevIcon={restaurant.imgUrls.length !== 1 ? undefined : null} >
                        {restaurant.imgUrls.map((url, index) => (
                            <Carousel.Item key={index}>
                                <div style={{ height: isMobile() ? '300px' : '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'black' }}>
                                    <img
                                        src={url}
                                        alt={`Slide ${index}`}
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                }
            </div>

            <h1 className='mt-3'>{restaurant.name}</h1>

            <div className='d-flex flex-row justify-content-around p-2' style={{ width: '100%' }}>
                <div>
                    <div className='mt-1'>
                        <a onClick={handleMapNavigation}> <FaHome />{restaurant.address}</a>
                    </div>
                    <div className='mt-1'>
                        <FaPhoneAlt /> +1 {restaurant.phoneNumber}
                    </div>
                    <div className='mt-2'>
                        {renderStars().map((star, index) => (
                            <span key={index}>{star}</span>
                        ))}
                    </div>
                    <div className='mt-2'>
                        Will be adding more information soon.
                        <br />
                        Meanwhile, click <a href={restaurant.url}>here</a> to visit their website.
                    </div>
                </div>

                <Map lat={restaurant.latitude} lng={restaurant.longitude} location={restaurant.name} />
            </div>
        </main>
    )
}

export default Restaurant
