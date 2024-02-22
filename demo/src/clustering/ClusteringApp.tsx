import { MapContainer, TileLayer } from 'react-leaflet'
import { TileContainer } from './TileContainer'

const mapCenter = [51.482084, 0] // Greenwich

export const ClusteringApp = () => (
    <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileContainer />
    </MapContainer>
)