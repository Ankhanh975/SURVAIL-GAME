// using UnityEngine;
// using System.Collections;
// using System.Collections.Generic;

class MeshGenerator extends MonoBehaviour {
  constructor() {
    this.squareGrid = null;
    this.walls = null;
    this.cave = null;

    this.is2D = null;

    this.vertices = null;
    this.triangles = null;

    this.triangleDictionary = new Dictionary();
    this.outlines = new Array();
    this.checkedVertices = new HashSet();
  }

  GenerateMesh(map, squareSize) {
    triangleDictionary.Clear();
    outlines.Clear();
    checkedVertices.Clear();

    let squareGrid = new SquareGrid(map, squareSize);

    let vertices = new Array();
    let triangles = new Array();

    for (let x = 0; x < squareGrid.squares.GetLength(0); x++) {
      for (let y = 0; y < squareGrid.squares.GetLength(1); y++) {
        this.TriangulateSquare(squareGrid.squares[(x, y)]);
      }
    }

    let mesh = new Mesh();
    cave.mesh = mesh;

    mesh.vertices = vertices.ToArray();
    mesh.triangles = triangles.ToArray();
    mesh.RecalculateNormals();

    let tileAmount = 10;
    let uvs = new Vector2([vertices.Count]);
    for (let i = 0; i < vertices.Count; i++) {
      let percentX =
        Math.InverseLerp(
          (-map.GetLength(0) / 2) * squareSize,
          (map.GetLength(0) / 2) * squareSize,
          vertices[i].x
        ) * tileAmount;
      let percentY =
        Math.InverseLerp(
          (-map.GetLength(0) / 2) * squareSize,
          (map.GetLength(0) / 2) * squareSize,
          vertices[i].z
        ) * tileAmount;
      uvs[i] = new Vector2(percentX, percentY);
    }
    mesh.uv = uvs;

    if (is2D) {
      this.Generate2DColliders();
    } else {
      this.CreateWallMesh();
    }
  }

  CreateWallMesh() {
    this.CalculateMeshOutlines();

    let wallVertices = new Array();
    let wallTriangles = new Array();
    let wallMesh = new Mesh();
    let wallHeight = 5;

    for (const outline of outlines) {
      for (let i = 0; i < outline.Count - 1; i++) {
        let startIndex = wallVertices.Count;
        wallVertices.Add(vertices[outline[i]]); // left
        wallVertices.Add(vertices[outline[i + 1]]); // right
        wallVertices.Add(vertices[outline[i]] - Vector3.up * wallHeight); // bottom left
        wallVertices.Add(vertices[outline[i + 1]] - Vector3.up * wallHeight); // bottom right

        wallTriangles.Add(startIndex + 0);
        wallTriangles.Add(startIndex + 2);
        wallTriangles.Add(startIndex + 3);

        wallTriangles.Add(startIndex + 3);
        wallTriangles.Add(startIndex + 1);
        wallTriangles.Add(startIndex + 0);
      }
    }
    wallMesh.vertices = wallVertices.ToArray();
    wallMesh.triangles = wallTriangles.ToArray();
    walls.mesh = wallMesh;

    let wallCollider = walls.gameObject.AddComponent();
    wallCollider.sharedMesh = wallMesh;
  }

  Generate2DColliders() {
    let currentColliders = gameObject.GetComponents();
    for (let i = 0; i < currentColliders.Length; i++) {
      Destroy(currentColliders[i]);
    }

    this.CalculateMeshOutlines();

    for (const outline of outlines) {
      let edgeCollider = gameObject.AddComponent();
      let edgePoints = new Vector2[outline.Count]();

      for (let i = 0; i < outline.Count; i++) {
        edgePoints[i] = new Vector2(
          vertices[outline[i]].x,
          vertices[outline[i]].z
        );
      }
      edgeCollider.points = edgePoints;
    }
  }

  TriangulateSquare(square) {
    switch (square.configuration) {
      case 0:
        break;

      // 1 points:
      case 1:
        MeshFromPoints(
          square.centreLeft,
          square.centreBottom,
          square.bottomLeft
        );
        break;
      case 2:
        MeshFromPoints(
          square.bottomRight,
          square.centreBottom,
          square.centreRight
        );
        break;
      case 4:
        MeshFromPoints(square.topRight, square.centreRight, square.centreTop);
        break;
      case 8:
        MeshFromPoints(square.topLeft, square.centreTop, square.centreLeft);
        break;

      // 2 points:
      case 3:
        MeshFromPoints(
          square.centreRight,
          square.bottomRight,
          square.bottomLeft,
          square.centreLeft
        );
        break;
      case 6:
        MeshFromPoints(
          square.centreTop,
          square.topRight,
          square.bottomRight,
          square.centreBottom
        );
        break;
      case 9:
        MeshFromPoints(
          square.topLeft,
          square.centreTop,
          square.centreBottom,
          square.bottomLeft
        );
        break;
      case 12:
        MeshFromPoints(
          square.topLeft,
          square.topRight,
          square.centreRight,
          square.centreLeft
        );
        break;
      case 5:
        MeshFromPoints(
          square.centreTop,
          square.topRight,
          square.centreRight,
          square.centreBottom,
          square.bottomLeft,
          square.centreLeft
        );
        break;
      case 10:
        MeshFromPoints(
          square.topLeft,
          square.centreTop,
          square.centreRight,
          square.bottomRight,
          square.centreBottom,
          square.centreLeft
        );
        break;

      // 3 point:
      case 7:
        MeshFromPoints(
          square.centreTop,
          square.topRight,
          square.bottomRight,
          square.bottomLeft,
          square.centreLeft
        );
        break;
      case 11:
        MeshFromPoints(
          square.topLeft,
          square.centreTop,
          square.centreRight,
          square.bottomRight,
          square.bottomLeft
        );
        break;
      case 13:
        MeshFromPoints(
          square.topLeft,
          square.topRight,
          square.centreRight,
          square.centreBottom,
          square.bottomLeft
        );
        break;
      case 14:
        MeshFromPoints(
          square.topLeft,
          square.topRight,
          square.bottomRight,
          square.centreBottom,
          square.centreLeft
        );
        break;

      // 4 point:
      case 15:
        MeshFromPoints(
          square.topLeft,
          square.topRight,
          square.bottomRight,
          square.bottomLeft
        );
        checkedVertices.Add(square.topLeft.vertexIndex);
        checkedVertices.Add(square.topRight.vertexIndex);
        checkedVertices.Add(square.bottomRight.vertexIndex);
        checkedVertices.Add(square.bottomLeft.vertexIndex);
        break;
    }
  }

  MeshFromPoints(points) {
    this.AssignVertices(points);

    if (points.Length >= 3)
      this.CreateTriangle(points[0], points[1], points[2]);
    if (points.Length >= 4)
      this.CreateTriangle(points[0], points[2], points[3]);
    if (points.Length >= 5)
      this.CreateTriangle(points[0], points[3], points[4]);
    if (points.Length >= 6)
      this.CreateTriangle(points[0], points[4], points[5]);
  }

  AssignVertices(points) {
    for (let i = 0; i < points.Length; i++) {
      if (points[i].vertexIndex == -1) {
        points[i].vertexIndex = vertices.Count;
        vertices.Add(points[i].position);
      }
    }
  }

  CreateTriangle(a, b, c) {
    this.triangles.Add(a.vertexIndex);
    this.triangles.Add(b.vertexIndex);
    this.triangles.Add(c.vertexIndex);

    let triangle = new Triangle(a.vertexIndex, b.vertexIndex, c.vertexIndex);
    this.AddTriangleToDictionary(triangle.vertexIndexA, triangle);
    this.AddTriangleToDictionary(triangle.vertexIndexB, triangle);
    this.AddTriangleToDictionary(triangle.vertexIndexC, triangle);
  }

  AddTriangleToDictionary(vertexIndexKey, triangle) {
    if (triangleDictionary.ContainsKey(vertexIndexKey)) {
      triangleDictionary[vertexIndexKey].Add(triangle);
    } else {
      let triangleList = new Array();
      triangleList.Add(triangle);
      triangleDictionary.Add(vertexIndexKey, triangleList);
    }
  }

  CalculateMeshOutlines() {
    for (let vertexIndex = 0; vertexIndex < vertices.Count; vertexIndex++) {
      if (!checkedVertices.Contains(vertexIndex)) {
        let newOutlineVertex = GetConnectedOutlineVertex(vertexIndex);
        if (newOutlineVertex != -1) {
          checkedVertices.Add(vertexIndex);

          let newOutline = new Array();
          newOutline.Add(vertexIndex);
          outlines.Add(newOutline);
          FollowOutline(newOutlineVertex, outlines.Count - 1);
          outlines[outlines.Count - 1].Add(vertexIndex);
        }
      }
    }
  }

  FollowOutline(vertexIndex, outlineIndex) {
    outlines[outlineIndex].Add(vertexIndex);
    checkedVertices.Add(vertexIndex);
    let nextVertexIndex = GetConnectedOutlineVertex(vertexIndex);

    if (nextVertexIndex != -1) {
      FollowOutline(nextVertexIndex, outlineIndex);
    }
  }

  GetConnectedOutlineVertex(vertexIndex) {
    let trianglesContainingVertex = triangleDictionary[vertexIndex];

    for (let i = 0; i < trianglesContainingVertex.Count; i++) {
      let triangle = trianglesContainingVertex[i];

      for (let j = 0; j < 3; j++) {
        let vertexB = triangle[j];
        if (vertexB != vertexIndex && !checkedVertices.Contains(vertexB)) {
          if (IsOutlineEdge(vertexIndex, vertexB)) {
            return vertexB;
          }
        }
      }
    }

    return -1;
  }

  IsOutlineEdge(vertexA, vertexB) {
    let trianglesContainingVertexA = triangleDictionary[vertexA];
    let sharedTriangleCount = 0;

    for (let i = 0; i < trianglesContainingVertexA.Count; i++) {
      if (trianglesContainingVertexA[i].Contains(vertexB)) {
        sharedTriangleCount++;
        if (sharedTriangleCount > 1) {
          break;
        }
      }
    }
    return sharedTriangleCount == 1;
  }
}
class Triangle {
  constructor(a, b, c) {
    this.vertexIndexA = a;
    this.vertexIndexB = b;
    this.vertexIndexC = c;

    this.vertices = new Array(3);
    this.vertices[0] = a;
    this.vertices[1] = b;
    this.vertices[2] = c;
  }

  Contains(vertexIndex) {
    return (
      vertexIndex == vertexIndexA ||
      vertexIndex == vertexIndexB ||
      vertexIndex == vertexIndexC
    );
  }
}

class SquareGrid {
  SquareGrid(map, squareSize) {
    let squares;
    let nodeCountX = map.GetLength(0);
    let nodeCountY = map.GetLength(1);
    let mapWidth = nodeCountX * squareSize;
    let mapHeight = nodeCountY * squareSize;

    let controlNodes = new ControlNode[(nodeCountX, nodeCountY)]();

    for (let x = 0; x < nodeCountX; x++) {
      for (let y = 0; y < nodeCountY; y++) {
        let pos = new Vector3(
          -mapWidth / 2 + x * squareSize + squareSize / 2,
          0,
          -mapHeight / 2 + y * squareSize + squareSize / 2
        );
        controlNodes[(x, y)] = new ControlNode(
          pos,
          map[(x, y)] == 1,
          squareSize
        );
      }
    }

    squares = new Square[(nodeCountX - 1, nodeCountY - 1)]();
    for (let x = 0; x < nodeCountX - 1; x++) {
      for (let y = 0; y < nodeCountY - 1; y++) {
        squares[(x, y)] = new Square(
          controlNodes[(x, y + 1)],
          controlNodes[(x + 1, y + 1)],
          controlNodes[(x + 1, y)],
          controlNodes[(x, y)]
        );
      }
    }
  }
}

class Square {
  constructor(_topLeft, _topRight, _bottomRight, _bottomLeft) {
    let topLeft, topRight, bottomRight, bottomLeft;
    let centreTop, centreRight, centreBottom, centreLeft;
    let configuration;
    this.topLeft = _topLeft;
    this.topRight = _topRight;
    this.bottomRight = _bottomRight;
    this.bottomLeft = _bottomLeft;
    this.centreTop = topLeft.right;
    this.centreRight = bottomRight.above;
    this.centreBottom = bottomLeft.right;
    this.centreLeft = bottomLeft.above;

    if (topLeft.active) configuration += 8;
    if (topRight.active) configuration += 4;
    if (bottomRight.active) configuration += 2;
    if (bottomLeft.active) configuration += 1;
  }
}

class Node {
  constructor(_pos) {
    this.position = _pos;
    this.vertexIndex = -1;
  }
}

class ControlNode extends Node {
  constructor(_pos, _active, squareSize) {
    super(_pos);
    this.active = _active;
    this.above = new Node(position + (Vector3.forward * squareSize) / 2);
    this.right = new Node(position + (Vector3.right * squareSize) / 2);
  }
}
