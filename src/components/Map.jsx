import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import React from 'react'

/*
@todo:
1. reset view 
*/

function Map({ lat, lng, location }) {
    return (
        <div className="leafletContainer">
            <MapContainer style={{ height: '100%', width: '100%' }}
                center={[lat, lng]} zoom={15} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <Marker position={[lat, lng]}>
                    <Popup>{location}</Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default Map
