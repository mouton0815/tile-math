import { Polyline, Rectangle } from 'react-leaflet'
import { cluster2boundaries, coords2tile, tiles2clusters, Coords, TileSet } from 'tile-math'
import { OSMContainer } from './OSMContainer'
import { sampleCoords } from './sample-coords'

const tileZoom = 14 // VeloViewer and others use zoom-level 14 tiles
const mapZoom  = 13
const mapCenter : Coords = [51.48, -0.008]

const tiles = new TileSet().addAll(sampleCoords.map(latLon => coords2tile(latLon, tileZoom)))
const { detached, surrounded, maxCluster } = tiles2clusters(tiles)
const nonCluster = detached.merge(surrounded) // Do not distinguish between normal tiles and smaller clusters
const boundaries = cluster2boundaries(maxCluster)

// TODO: Description
const TileContainer = () => (
    <div>
        <>
            {nonCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'red', weight: 0.5 }} />
            ))}
        </>
        <>
            {maxCluster.map((tile, index) => (
                <Rectangle key={index} bounds={tile.bounds(tileZoom)} pathOptions={{ color: 'blue', weight: 0.5 }} />
            ))}
        </>
        <>
            {boundaries.map((line, index) => (
                <Polyline key={index} positions={line.positions(tileZoom)} pathOptions={{ color: 'blue', weight: 3 }} />
            ))}
        </>
    </div>
)

export const BoundariesApp = () => (
    <OSMContainer TileContainer={TileContainer} mapCenter={mapCenter} mapZoom={mapZoom} />
)
