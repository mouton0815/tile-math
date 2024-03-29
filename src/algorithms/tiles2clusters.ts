import { TileSet } from '../containers/TileSet'
import { TileClusters } from '../containers/TileClusters'
import { TileNo } from '../types/TileNo'

/**
 * Finds all tile clusters in a {@link TileSet} and stores them in a {@link TileClusters} object.
 * @param allTiles - a tile set
 * @returns all tile clusters of the tile set
 */
export function tiles2clusters(allTiles: TileSet): TileClusters {
    const zoom = allTiles.getZoom()
    let allClusters = new Array<TileSet>()
    const closedClusters = new Array<TileSet>()
    const detachedTiles = new TileSet(zoom)
    for (const x of allTiles.getSortedXs()) {
        // Remove every cluster that cannot contain any further processed tile with larger x values
        allClusters = allClusters.filter(cluster => {
            if (cluster.isLeftOf(x)) {
                closedClusters.push(cluster)
                return false
            }
            return true
        })
        for (const y of allTiles.getSortedYs(x)) {
            const tile : TileNo = { x, y }
            if (allTiles.hasNeighbors(tile)) {
                let prevCluster : TileSet | null = null
                // Use filter function to allow in-place deletion of merged clusters
                allClusters = allClusters.filter(cluster => {
                    if (cluster.hasNeighbor(tile)) {
                        if (prevCluster) {
                            // Tile is neighbor of prevCluster (and has been added to it)
                            // and of the current cluster: merge both clusters
                            prevCluster.merge(cluster)
                            return false
                        }
                        cluster.addTile(tile)
                        prevCluster = cluster
                    }
                    return true
                })
                if (prevCluster === null) {
                    // Tile has four neighbors, but does not belong to an existing cluster yet
                    allClusters.push(new TileSet(zoom).addTiles([tile]))
                }
            } else {
                detachedTiles.addTile(tile)
            }
        }
    }
    allClusters.unshift(...closedClusters)

    // Select the cluster with the largest size
    const maxCluster = allClusters.reduce((prev, curr) => {
        return curr.getSize() > prev.getSize() ? curr : prev
    }, new TileSet(zoom))

    // Merge all other cluster candidates (and filter out maxCluster)
    const minorClusters = allClusters.reduce((prev, curr) => {
        if (curr === maxCluster) {
            return prev
        }
        // Merge the smaller cluster into the larger one
        if (prev.getSize() >= curr.getSize()) {
            return prev.merge(curr)
        }
        return curr.merge(prev)
    }, new TileSet(zoom))

    return { allTiles, allClusters, detachedTiles, minorClusters, maxCluster }
}
