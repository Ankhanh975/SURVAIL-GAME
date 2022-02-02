var matrix = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
];
var grid = new PF.Grid(matrix);

// The prefix Bi for the last four finders in the above list stands for the bi-directional searching strategy.

// BiAStarFinder are not guaranteed to find the shortest path.
// To build a path-finder, say, the BiAStarFinder:

var finder = new PF.BiAStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true
});

var path = finder.findPath(1, 2, 4, 2, grid.clone());
var newPath = PF.Util.smoothenPath(grid, path);
// var newPath = PF.Util.compressPath(path);

// To smoothen the path, you may use PF.Util.smoothenPath. This routine will return a new path with the original one unmodified.
// Note that the new path will be compressed as well, i.e. if the original path is [[0, 1], [0, 2], [0, 3], [0, 4]], then the new path will be [[0, 1], [0, 4]].
