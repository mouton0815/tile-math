import { Rectangle, Polyline } from 'react-leaflet'
import { coords2tile, Coords, TileSet } from 'tile-math'
import { OSMContainer } from '../OSMContainer'
import { sampleCoords } from '../sample-coords'

const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const mapZoom  = 13
const mapCenter : Coords = [51.48, -0.008]

// Map all coordinates to tile names (https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
// and add them to a set. Duplicate tiles are ignored.
const tiles = new TileSet().addAll(sampleCoords.map(latLon => coords2tile(latLon, tileZoom)))

// For every tile, draws a red square on the map, using the Tile.bounds method.
const TileContainer = () => (
    <div>
        {tiles.map((tile, index) => (
            <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'red', weight: 0.5 }} />
        ))}
        <Polyline positions={sampleCoords} />
    </div>
)

export const TrackTilesApp = () => (
    <OSMContainer TileContainer={TileContainer} mapCenter={mapCenter} mapZoom={mapZoom} />
)
