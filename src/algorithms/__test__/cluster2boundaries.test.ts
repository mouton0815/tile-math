import { BoundarySegment } from '../../types/BoundarySegment'
import { TileSet } from '../../containers/TileSet'
import { cluster2boundaries } from '../cluster2boundaries'

test('cluster2boundaries-empty', () => {
    const boundaries = cluster2boundaries(new TileSet(0))
    expect(boundaries.array.length).toBe(0)
})

test('cluster2boundaries-half-open', () => {
    //     1
    // 1 | x |
    const cluster = new TileSet(0).addTile({ x: 1, y: 1 })
    const array = [...cluster2boundaries(cluster)]
    expect(array.length).toBe(1)
    expect(array[0].segments).toEqual([
        BoundarySegment.of(2, 2, 2, 1), // Right segment
        BoundarySegment.of(2, 1, 1, 1), // Upper segment
        BoundarySegment.of(1, 1, 1, 2), // Left segment
        BoundarySegment.of(1, 2, 2, 2), // Lower segment
    ])
})

test('cluster2boundaries-right-open', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 | x |   |   |
    // 3 | x |   | x |
    // 4 | x | x | x |
    const cluster = new TileSet(0).addTiles([ // Insert in 'random' order
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
        { x: 3, y: 3 },
        { x: 1, y: 1 },
        { x: 1, y: 3 },
        { x: 3, y: 1 },
        { x: 1, y: 4 },
    ])
    const array = [...cluster2boundaries(cluster)]
    expect(array.length).toBe(1)
    expect(array[0].segments).toEqual([
        BoundarySegment.of(4, 5, 4, 3), // Right segment (lower)
        BoundarySegment.of(4, 3, 3, 3), // Upper segment (lower right)
        BoundarySegment.of(3, 3, 3, 4), // Left segment (lower right)
        BoundarySegment.of(3, 4, 2, 4), // Upper segment (lower middle)
        BoundarySegment.of(2, 4, 2, 2), // Right segment (middle)
        BoundarySegment.of(2, 2, 4, 2), // Lower segment (upper)
        BoundarySegment.of(4, 2, 4, 1), // Right segment (upper)
        BoundarySegment.of(4, 1, 1, 1), // Upper segment
        BoundarySegment.of(1, 1, 1, 5), // Left segment
        BoundarySegment.of(1, 5, 4, 5), // Lower segment
    ])
})

test('cluster2boundaries-left-open', () => {
    //     1   2   3
    // 1 | x | x | x |
    // 2 |   |   | x |
    // 3 | x |   | x |
    // 4 | x | x | x |
    const cluster = new TileSet(0).addTiles([ // Insert in 'random' order
        { x: 1, y: 3 },
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 2, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 1, y: 4 },
    ])
    const array = [...cluster2boundaries(cluster)]
    expect(array.length).toBe(1)
    expect(array[0].segments).toEqual([
        BoundarySegment.of(4, 5, 4, 1), // Right segment
        BoundarySegment.of(4, 1, 1, 1), // Upper segment
        BoundarySegment.of(1, 1, 1, 2), // Left segment (upper)
        BoundarySegment.of(1, 2, 3, 2), // Lower segment (upper)
        BoundarySegment.of(3, 2, 3, 4), // Left segment (right)
        BoundarySegment.of(3, 4, 2, 4), // Upper segment (lower middle)
        BoundarySegment.of(2, 4, 2, 3), // Right segment (left)
        BoundarySegment.of(2, 3, 1, 3), // Upper segment (left)
        BoundarySegment.of(1, 3, 1, 5), // Left segment (lower)
        BoundarySegment.of(1, 5, 4, 5), // Lower segment
    ])
})

test('cluster2boundaries-inner-outer', () => {
    //     1   2   3   4
    // 1 | x | x | x | x |
    // 2 | x |   |   | x |
    // 3 | x | x | x | x |
    const cluster = new TileSet(0).addTiles([ // Insert in 'random' order
        { x: 3, y: 3 },
        { x: 1, y: 2 },
        { x: 4, y: 3 },
        { x: 2, y: 3 },
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 2 },
        { x: 2, y: 1 },
        { x: 1, y: 3 },
        { x: 4, y: 1 },
        { x: 4, y: 3 },
    ])
    const array = [...cluster2boundaries(cluster)]
    expect(array.length).toBe(2)
    // Outer boundary
    expect(array[0].segments).toEqual([
        BoundarySegment.of(5, 4, 5, 1), // Right segment
        BoundarySegment.of(5, 1, 1, 1), // Upper segment
        BoundarySegment.of(1, 1, 1, 4), // Left segment
        BoundarySegment.of(1, 4, 5, 4), // Lower segment
    ])
    // Inner boundary
    expect(array[1].segments).toEqual([
        BoundarySegment.of(4, 3, 2, 3), // Lower segment
        BoundarySegment.of(2, 3, 2, 2), // Left segment
        BoundarySegment.of(2, 2, 4, 2), // Upper segment
        BoundarySegment.of(4, 2, 4, 3), // Right segment
    ])
})

test('cluster2boundaries-non-connected', () => {
    // This is not a regular max cluster because tile [3,2] is not connected.
    // Still the algorithms works and finds complete and unique line segments.
    //     1   2   3
    // 1 | x | x |   |
    // 2 | x |   | x |
    // 3 | x | x |   |
    // 4 |   | x | x |
    const cluster = new TileSet(0).addTiles([ // Insert in 'random' order
        { x: 1, y: 2 },
        { x: 3, y: 2 },
        { x: 3, y: 4 },
        { x: 2, y: 3 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 3 },
        { x: 2, y: 4 },
    ])
    const array = [...cluster2boundaries(cluster)]
    expect(array.length).toBe(2)
    // Boundary of main area
    expect(array[0].segments).toEqual([
        BoundarySegment.of(4, 5, 4, 4), // Right segment (lower)
        BoundarySegment.of(4, 4, 3, 4), // Upper segment (lower right)
        BoundarySegment.of(3, 4, 3, 3), // Right segment (lower inner)
        BoundarySegment.of(3, 3, 2, 3), // Upper segment (inner)
        BoundarySegment.of(2, 3, 2, 2), // Right segment (inner)
        BoundarySegment.of(2, 2, 3, 2), // Upper segment (inner)
        BoundarySegment.of(3, 2, 3, 1), // Right segment (upper)
        BoundarySegment.of(3, 1, 1, 1), // Upper segment
        BoundarySegment.of(1, 1, 1, 4), // Left segment (upper)
        BoundarySegment.of(1, 4, 2, 4), // Lower segment (left)
        BoundarySegment.of(2, 4, 2, 5), // Left segment (lower)
        BoundarySegment.of(2, 5, 4, 5), // Lower segment (middle)
    ])
    // Boundary of single non-connected tile
    expect(array[1].segments).toEqual([
        BoundarySegment.of(4, 3, 4, 2), // Right segment
        BoundarySegment.of(4, 2, 3, 2), // Upper segment (right)
        BoundarySegment.of(3, 2, 3, 3), // Left segment (inner)
        BoundarySegment.of(3, 3, 4, 3), // Lower segment (right)
    ])
})
