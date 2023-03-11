(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        // https://github.com/Prozi/detect-collisions
        const { System } = require("../node_modules/detect-collisions/dist");

        globalThis.Collisions = System;
      },
      { "../node_modules/detect-collisions/dist": 8 },
    ],
    2: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Box = void 0;
        const model_1 = require("../model");
        const utils_1 = require("../utils");
        const polygon_1 = require("./polygon");
        /**
         * collider - box
         */
        class Box extends polygon_1.Polygon {
          /**
           * collider - box
           * @param {Vector} position {x, y}
           * @param {number} width
           * @param {number} height
           */
          constructor(position, width, height) {
            super(position, (0, utils_1.createBox)(width, height));
            this.type = model_1.Types.Box;
            this._width = width;
            this._height = height;
          }
          /**
           * get box width
           */
          get width() {
            return this._width;
          }
          /**
           * set box width, update points
           */
          set width(width) {
            this._width = width;
            this.setPoints((0, utils_1.createBox)(this._width, this._height));
          }
          /**
           * get box height
           */
          get height() {
            return this._height;
          }
          /**
           * set box height, update points
           */
          set height(height) {
            this._height = height;
            this.setPoints((0, utils_1.createBox)(this._width, this._height));
          }
          getCentroidWithoutRotation() {
            // reset angle for get centroid
            const angle = this.angle;
            this.setAngle(0);
            const centroid = this.getCentroid();
            // revert angle change
            this.setAngle(angle);
            return centroid;
          }
          /**
           * reCenters the box anchor
           */
          center() {
            const firstPoint = this.points[0];
            // skip if has original points translated already
            if (firstPoint.x !== 0 || firstPoint.y !== 0) {
              return;
            }
            const { x, y } = this.getCentroidWithoutRotation();
            this.translate(-x, -y);
            this.setPosition(this.pos.x + x, this.pos.y + y);
          }
        }
        exports.Box = Box;
      },
      { "../model": 9, "../utils": 11, "./polygon": 7 },
    ],
    3: [
      function (require, module, exports) {
        "use strict";
        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Circle = void 0;
        const sat_1 = __importDefault(require("sat"));
        const model_1 = require("../model");
        const utils_1 = require("../utils");
        /**
         * collider - circle
         */
        class Circle extends sat_1.default.Circle {
          /**
           * collider - circle
           * @param {Vector} position {x, y}
           * @param {number} radius
           */
          constructor(position, radius) {
            super((0, utils_1.ensureVectorPoint)(position), radius);
            this.type = model_1.Types.Circle;
            this.updateAABB();
          }
          get x() {
            return this.pos.x;
          }
          /**
           * updating this.pos.x by this.x = x updates AABB
           */
          set x(x) {
            var _a;
            this.pos.x = x;
            (_a = this.system) === null || _a === void 0
              ? void 0
              : _a.updateBody(this);
          }
          get y() {
            return this.pos.y;
          }
          /**
           * updating this.pos.y by this.y = y updates AABB
           */
          set y(y) {
            var _a;
            this.pos.y = y;
            (_a = this.system) === null || _a === void 0
              ? void 0
              : _a.updateBody(this);
          }
          /**
           * update position
           * @param {number} x
           * @param {number} y
           */
          setPosition(x, y) {
            var _a;
            this.pos.x = x;
            this.pos.y = y;
            (_a = this.system) === null || _a === void 0
              ? void 0
              : _a.updateBody(this);
          }
          /**
           * Updates Bounding Box of collider
           */
          updateAABB() {
            this.minX = this.pos.x - this.r;
            this.minY = this.pos.y - this.r;
            this.maxX = this.pos.x + this.r;
            this.maxY = this.pos.y + this.r;
          }
          /**
           * Draws collider on a CanvasRenderingContext2D's current path
           * @param {CanvasRenderingContext2D} context The canvas context to draw on
           */
          draw(context) {
            const radius = this.r;
            if (this.isTrigger) {
              const max = Math.max(8, radius);
              for (let i = 0; i < max; i++) {
                const arc = (i / max) * 2 * Math.PI;
                const arcPrev = ((i - 1) / max) * 2 * Math.PI;
                const fromX = this.pos.x + Math.cos(arcPrev) * radius;
                const fromY = this.pos.y + Math.sin(arcPrev) * radius;
                const toX = this.pos.x + Math.cos(arc) * radius;
                const toY = this.pos.y + Math.sin(arc) * radius;
                (0, utils_1.dashLineTo)(context, fromX, fromY, toX, toY);
              }
            } else {
              context.moveTo(this.pos.x + radius, this.pos.y);
              context.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2);
            }
          }
        }
        exports.Circle = Circle;
      },
      { "../model": 9, "../utils": 11, sat: 13 },
    ],
    4: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Line = void 0;
        const model_1 = require("../model");
        const polygon_1 = require("./polygon");
        /**
         * collider - line
         */
        class Line extends polygon_1.Polygon {
          /**
           * collider - line from start to end
           * @param {Vector} start {x, y}
           * @param {Vector} end {x, y}
           */
          constructor(start, end) {
            // position at middle of (start, end)
            super({ x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }, [
              // first point at minus half length
              { x: -(end.x - start.x) / 2, y: -(end.y - start.y) / 2 },
              // second point at plus half length
              { x: (end.x - start.x) / 2, y: (end.y - start.y) / 2 },
            ]);
            this.type = model_1.Types.Line;
            if (this.calcPoints.length === 1 || !end) {
              console.error({ start, end });
              throw new Error("No end point for line provided");
            }
          }
          get start() {
            return {
              x: this.x + this.calcPoints[0].x,
              y: this.y + this.calcPoints[0].y,
            };
          }
          get end() {
            return {
              x: this.x + this.calcPoints[1].x,
              y: this.y + this.calcPoints[1].y,
            };
          }
        }
        exports.Line = Line;
      },
      { "../model": 9, "./polygon": 7 },
    ],
    5: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Oval = void 0;
        const model_1 = require("../model");
        const utils_1 = require("../utils");
        const polygon_1 = require("./polygon");
        /**
         * collider - oval
         */
        class Oval extends polygon_1.Polygon {
          /**
           * collider - oval
           * @param {Vector} position {x, y}
           * @param {number} radiusX
           * @param {number} radiusY defaults to radiusX
           * @param {number} step precision division >= 1px
           */
          constructor(position, radiusX, radiusY = radiusX, step = 1) {
            super(position, (0, utils_1.createOval)(radiusX, radiusY, step));
            this.type = model_1.Types.Oval;
            this._radiusX = radiusX;
            this._radiusY = radiusY;
            this._step = step;
          }
          /**
           * get oval step number
           */
          get step() {
            return this._step;
          }
          /**
           * set oval step number
           */
          set step(step) {
            this._step = step;
            this.setPoints(
              (0, utils_1.createOval)(this._radiusX, this._radiusY, this._step)
            );
          }
          /**
           * get oval radiusX
           */
          get radiusX() {
            return this._radiusX;
          }
          /**
           * set oval radiusX, update points
           */
          set radiusX(radiusX) {
            this._radiusX = radiusX;
            this.setPoints(
              (0, utils_1.createOval)(this._radiusX, this._radiusY, this._step)
            );
          }
          /**
           * get oval radiusY
           */
          get radiusY() {
            return this._radiusY;
          }
          /**
           * set oval radiusY, update points
           */
          set radiusY(radiusY) {
            this._radiusY = radiusY;
            this.setPoints(
              (0, utils_1.createOval)(this._radiusX, this._radiusY, this._step)
            );
          }
        }
        exports.Oval = Oval;
      },
      { "../model": 9, "../utils": 11, "./polygon": 7 },
    ],
    6: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Point = void 0;
        const box_1 = require("./box");
        const model_1 = require("../model");
        const utils_1 = require("../utils");
        /**
         * collider - point (very tiny box)
         */
        class Point extends box_1.Box {
          /**
           * collider - point (very tiny box)
           * @param {Vector} position {x, y}
           */
          constructor(position) {
            super((0, utils_1.ensureVectorPoint)(position), 0.1, 0.1);
            this.type = model_1.Types.Point;
          }
        }
        exports.Point = Point;
      },
      { "../model": 9, "../utils": 11, "./box": 2 },
    ],
    7: [
      function (require, module, exports) {
        "use strict";
        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Polygon = void 0;
        const sat_1 = __importDefault(require("sat"));
        const model_1 = require("../model");
        const utils_1 = require("../utils");
        /**
         * collider - polygon
         */
        class Polygon extends sat_1.default.Polygon {
          /**
           * collider - polygon
           * @param {Vector} position {x, y}
           * @param {Vector[]} points
           */
          constructor(position, points) {
            super(
              (0, utils_1.ensureVectorPoint)(position),
              (0, utils_1.ensurePolygonPoints)(points)
            );
            this.type = model_1.Types.Polygon;
            if (
              !(points === null || points === void 0 ? void 0 : points.length)
            ) {
              throw new Error("No points in polygon");
            }
            this.updateAABB();
          }
          get x() {
            return this.pos.x;
          }
          /**
           * updating this.pos.x by this.x = x updates AABB
           */
          set x(x) {
            var _a;
            this.pos.x = x;
            (_a = this.system) === null || _a === void 0
              ? void 0
              : _a.updateBody(this);
          }
          get y() {
            return this.pos.y;
          }
          /**
           * updating this.pos.y by this.y = y updates AABB
           */
          set y(y) {
            var _a;
            this.pos.y = y;
            (_a = this.system) === null || _a === void 0
              ? void 0
              : _a.updateBody(this);
          }
          /**
           * update position
           * @param {number} x
           * @param {number} y
           */
          setPosition(x, y) {
            var _a;
            this.pos.x = x;
            this.pos.y = y;
            (_a = this.system) === null || _a === void 0
              ? void 0
              : _a.updateBody(this);
          }
          /**
           * Updates Bounding Box of collider
           */
          updateAABB() {
            const { pos, w, h } = this.getAABBAsBox();
            this.minX = pos.x;
            this.minY = pos.y;
            this.maxX = pos.x + w;
            this.maxY = pos.y + h;
          }
          /**
           * Draws collider on a CanvasRenderingContext2D's current path
           * @param {CanvasRenderingContext2D} context The canvas context to draw on
           */
          draw(context) {
            const points = [...this.calcPoints, this.calcPoints[0]];
            points.forEach((point, index) => {
              const toX = this.pos.x + point.x;
              const toY = this.pos.y + point.y;
              const prev =
                this.calcPoints[index - 1] ||
                this.calcPoints[this.calcPoints.length - 1];
              if (!index) {
                if (this.calcPoints.length === 1) {
                  context.arc(toX, toY, 1, 0, Math.PI * 2);
                } else {
                  context.moveTo(toX, toY);
                }
              } else if (this.calcPoints.length > 1) {
                if (this.isTrigger) {
                  const fromX = this.pos.x + prev.x;
                  const fromY = this.pos.y + prev.y;
                  (0, utils_1.dashLineTo)(context, fromX, fromY, toX, toY);
                } else {
                  context.lineTo(toX, toY);
                }
              }
            });
          }
        }
        exports.Polygon = Polygon;
      },
      { "../model": 9, "../utils": 11, sat: 13 },
    ],
    8: [
      function (require, module, exports) {
        "use strict";
        var __createBinding =
          (this && this.__createBinding) ||
          (Object.create
            ? function (o, m, k, k2) {
                if (k2 === undefined) k2 = k;
                var desc = Object.getOwnPropertyDescriptor(m, k);
                if (
                  !desc ||
                  ("get" in desc
                    ? !m.__esModule
                    : desc.writable || desc.configurable)
                ) {
                  desc = {
                    enumerable: true,
                    get: function () {
                      return m[k];
                    },
                  };
                }
                Object.defineProperty(o, k2, desc);
              }
            : function (o, m, k, k2) {
                if (k2 === undefined) k2 = k;
                o[k2] = m[k];
              });
        var __exportStar =
          (this && this.__exportStar) ||
          function (m, exports) {
            for (var p in m)
              if (
                p !== "default" &&
                !Object.prototype.hasOwnProperty.call(exports, p)
              )
                __createBinding(exports, m, p);
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        __exportStar(require("./model"), exports);
        __exportStar(require("./bodies/circle"), exports);
        __exportStar(require("./bodies/oval"), exports);
        __exportStar(require("./bodies/polygon"), exports);
        __exportStar(require("./bodies/box"), exports);
        __exportStar(require("./bodies/point"), exports);
        __exportStar(require("./bodies/line"), exports);
        __exportStar(require("./system"), exports);
        __exportStar(require("./utils"), exports);
      },
      {
        "./bodies/box": 2,
        "./bodies/circle": 3,
        "./bodies/line": 4,
        "./bodies/oval": 5,
        "./bodies/point": 6,
        "./bodies/polygon": 7,
        "./model": 9,
        "./system": 10,
        "./utils": 11,
      },
    ],
    9: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Types = exports.Response = void 0;
        var sat_1 = require("sat");
        Object.defineProperty(exports, "Response", {
          enumerable: true,
          get: function () {
            return sat_1.Response;
          },
        });
        /**
         * types
         */
        var Types;
        (function (Types) {
          Types["Oval"] = "Oval";
          Types["Line"] = "Line";
          Types["Circle"] = "Circle";
          Types["Box"] = "Box";
          Types["Point"] = "Point";
          Types["Polygon"] = "Polygon";
        })((Types = exports.Types || (exports.Types = {})));
      },
      { sat: 13 },
    ],
    10: [
      function (require, module, exports) {
        "use strict";
        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.System = void 0;
        const sat_1 = __importDefault(require("sat"));
        const rbush_1 = __importDefault(require("rbush"));
        const model_1 = require("./model");
        const utils_1 = require("./utils");
        const _1 = require(".");
        const oval_1 = require("./bodies/oval");
        /**
         * collision system
         */
        class System extends rbush_1.default {
          constructor() {
            super(...arguments);
            this.response = new sat_1.default.Response();
          }
          // https://stackoverflow.com/questions/37224912/circle-line-segment-collision
          static intersectLineCircle(line, circle) {
            const v1 = {
              x: line.end.x - line.start.x,
              y: line.end.y - line.start.y,
            };
            const v2 = {
              x: line.start.x - circle.pos.x,
              y: line.start.y - circle.pos.y,
            };
            const b = (v1.x * v2.x + v1.y * v2.y) * -2;
            const c = 2 * (v1.x * v1.x + v1.y * v1.y);
            const d = Math.sqrt(
              b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.r * circle.r)
            );
            if (isNaN(d)) {
              // no intercept
              return [];
            }
            const u1 = (b - d) / c; // these represent the unit distance of point one and two on the line
            const u2 = (b + d) / c;
            const results = []; // return array
            if (u1 <= 1 && u1 >= 0) {
              // add point if on the line segment
              results.push({
                x: line.start.x + v1.x * u1,
                y: line.start.y + v1.y * u1,
              });
            }
            if (u2 <= 1 && u2 >= 0) {
              // second add point if on the line segment
              results.push({
                x: line.start.x + v1.x * u2,
                y: line.start.y + v1.y * u2,
              });
            }
            return results;
          }
          // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
          static intersectLineLine(line1, line2) {
            const dX = line1.end.x - line1.start.x;
            const dY = line1.end.y - line1.start.y;
            const determinant =
              dX * (line2.end.y - line2.start.y) -
              (line2.end.x - line2.start.x) * dY;
            if (determinant === 0) {
              return null;
            }
            const lambda =
              ((line2.end.y - line2.start.y) * (line2.end.x - line1.start.x) +
                (line2.start.x - line2.end.x) * (line2.end.y - line1.start.y)) /
              determinant;
            const gamma =
              ((line1.start.y - line1.end.y) * (line2.end.x - line1.start.x) +
                dX * (line2.end.y - line1.start.y)) /
              determinant;
            // check if there is an intersection
            if (!(0 <= lambda && lambda <= 1) || !(0 <= gamma && gamma <= 1)) {
              return null;
            }
            return {
              x: line1.start.x + lambda * dX,
              y: line1.start.y + lambda * dY,
            };
          }
          /**
           * draw bodies
           * @param {CanvasRenderingContext2D} context
           */
          draw(context) {
            this.all().forEach((body) => {
              body.draw(context);
            });
          }
          /**
           * draw hierarchy
           * @param {CanvasRenderingContext2D} context
           */
          drawBVH(context) {
            this.data.children.forEach(({ minX, maxX, minY, maxY }) => {
              _1.Polygon.prototype.draw.call(
                {
                  pos: { x: minX, y: minY },
                  calcPoints: (0, utils_1.createBox)(maxX - minX, maxY - minY),
                },
                context
              );
            });
            this.all().forEach((body) => {
              const { pos, w, h } = body.getAABBAsBox();
              _1.Polygon.prototype.draw.call(
                {
                  pos,
                  calcPoints: (0, utils_1.createBox)(w, h),
                },
                context
              );
            });
          }
          /**
           * update body aabb and in tree
           * @param {object} body
           */
          updateBody(body) {
            // old aabb needs to be removed
            this.remove(body);
            // then we update aabb
            body.updateAABB();
            // then we reinsert body to collision tree
            this.insert(body);
          }
          /**
           * remove body aabb from collision tree
           * @param body
           * @param equals
           * @returns System
           */
          remove(body, equals) {
            body.system = null;
            return super.remove(body, equals);
          }
          /**
           * add body aabb to collision tree
           * @param body
           * @returns System
           */
          insert(body) {
            body.system = this;
            return super.insert(body);
          }
          /**
           * update all bodies aabb
           */
          update() {
            this.all().forEach((body) => {
              // no need to every cycle update static body aabb
              if (!body.isStatic) {
                this.updateBody(body);
              }
            });
          }
          /**
           * separate (move away) colliders
           */
          separate() {
            this.checkAll((response) => {
              // static bodies and triggers do not move back / separate
              if (response.a.isTrigger) {
                return;
              }
              response.a.pos.x -= response.overlapV.x;
              response.a.pos.y -= response.overlapV.y;
              this.updateBody(response.a);
            });
          }
          /**
           * check one collider collisions with callback
           * @param {function} callback
           */
          checkOne(body, callback) {
            // no need to check static body collision
            if (body.isStatic) {
              return;
            }
            this.getPotentials(body).forEach((candidate) => {
              if (this.checkCollision(body, candidate)) {
                callback(this.response);
              }
            });
          }
          /**
           * check all colliders collisions with callback
           * @param {function} callback
           */
          checkAll(callback) {
            this.all().forEach((body) => {
              this.checkOne(body, callback);
            });
          }
          /**
           * get object potential colliders
           * @param {object} collider
           */
          getPotentials(body) {
            // filter here is required as collides with self
            return this.search(body).filter((candidate) => candidate !== body);
          }
          /**
           * check do 2 objects collide
           * @param {object} collider
           * @param {object} candidate
           */
          checkCollision(body, candidate) {
            this.response.clear();
            if (
              body.type === model_1.Types.Circle &&
              candidate.type === model_1.Types.Circle
            ) {
              return sat_1.default.testCircleCircle(
                body,
                candidate,
                this.response
              );
            }
            if (
              body.type === model_1.Types.Circle &&
              candidate.type !== model_1.Types.Circle
            ) {
              return sat_1.default.testCirclePolygon(
                body,
                candidate,
                this.response
              );
            }
            if (
              body.type !== model_1.Types.Circle &&
              candidate.type === model_1.Types.Circle
            ) {
              return sat_1.default.testPolygonCircle(
                body,
                candidate,
                this.response
              );
            }
            if (
              body.type !== model_1.Types.Circle &&
              candidate.type !== model_1.Types.Circle
            ) {
              return sat_1.default.testPolygonPolygon(
                body,
                candidate,
                this.response
              );
            }
          }
          /**
           * raycast to get collider of ray from start to end
           * @param {Vector} start {x, y}
           * @param {Vector} end {x, y}
           * @returns {TBody}
           */
          raycast(start, end, allowCollider = () => true) {
            const ray = this.createLine(start, end);
            const colliders = this.getPotentials(ray).filter(
              (potential) =>
                allowCollider(potential) && this.checkCollision(ray, potential)
            );
            this.remove(ray);
            const results = [];
            const sort = (0, utils_1.closest)(start);
            colliders.forEach((collider) => {
              switch (collider.type) {
                case model_1.Types.Circle: {
                  const points = System.intersectLineCircle(ray, collider);
                  results.push(...points.map((point) => ({ point, collider })));
                  break;
                }
                default: {
                  const points = collider.calcPoints
                    .map((to, index) => {
                      const from = index
                        ? collider.calcPoints[index - 1]
                        : collider.calcPoints[collider.calcPoints.length - 1];
                      const line = new _1.Line(
                        {
                          x: from.x + collider.pos.x,
                          y: from.y + collider.pos.y,
                        },
                        { x: to.x + collider.pos.x, y: to.y + collider.pos.y }
                      );
                      return System.intersectLineLine(ray, line);
                    })
                    .filter((test) => !!test);
                  results.push(...points.map((point) => ({ point, collider })));
                  break;
                }
              }
            });
            return results.sort(sort)[0];
          }
          /**
           * create point
           * @param {Vector} position {x, y}
           */
          createPoint(position) {
            const point = new _1.Point(position);
            this.insert(point);
            return point;
          }
          /**
           * create line
           * @param {Vector} start {x, y}
           * @param {Vector} end {x, y}
           */
          createLine(start, end, angle = 0) {
            const line = new _1.Line(start, end);
            line.setAngle(angle);
            this.insert(line);
            return line;
          }
          /**
           * create circle
           * @param {Vector} position {x, y}
           * @param {number} radius
           */
          createCircle(position, radius) {
            const circle = new _1.Circle(position, radius);
            this.insert(circle);
            return circle;
          }
          /**
           * create box
           * @param {Vector} position {x, y}
           * @param {number} width
           * @param {number} height
           * @param {number} angle
           */
          createBox(position, width, height, angle = 0) {
            const box = new _1.Box(position, width, height);
            box.setAngle(angle);
            this.insert(box);
            return box;
          }
          /**
           * create oval
           * @param {Vector} position {x, y}
           * @param {number} radiusX
           * @param {number} radiusY
           * @param {number} step
           * @param {number} angle
           */
          createOval(position, radiusX, radiusY, step = 1, angle = 0) {
            const oval = new oval_1.Oval(position, radiusX, radiusY, step);
            oval.setAngle(angle);
            this.insert(oval);
            return oval;
          }
          /**
           * create polygon
           * @param {Vector} position {x, y}
           * @param {Vector[]} points
           * @param {number} angle
           */
          createPolygon(position, points, angle = 0) {
            const polygon = new _1.Polygon(position, points);
            polygon.setAngle(angle);
            this.insert(polygon);
            return polygon;
          }
        }
        exports.System = System;
      },
      {
        ".": 8,
        "./bodies/oval": 5,
        "./model": 9,
        "./utils": 11,
        rbush: 12,
        sat: 13,
      },
    ],
    11: [
      function (require, module, exports) {
        "use strict";
        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.dashLineTo =
          exports.clockwise =
          exports.closest =
          exports.distance =
          exports.ensurePolygonPoints =
          exports.ensureVectorPoint =
          exports.createBox =
          exports.createOval =
            void 0;
        const sat_1 = __importDefault(require("sat"));
        function createOval(radiusX, radiusY = radiusX, step = 1) {
          const steps = 2 * Math.PI * Math.hypot(radiusX, radiusY);
          const length = Math.max(8, Math.ceil(steps / step));
          return Array.from({ length }, (_, index) => {
            const value = (index / length) * 2 * Math.PI;
            const x = Math.cos(value) * radiusX;
            const y = Math.sin(value) * radiusY;
            return new sat_1.default.Vector(x, y);
          });
        }
        exports.createOval = createOval;
        /**
         * creates box polygon points
         * @param {number} width
         * @param {number} height
         * @returns SAT.Vector
         */
        function createBox(width, height) {
          return [
            new sat_1.default.Vector(),
            new sat_1.default.Vector(width, 0),
            new sat_1.default.Vector(width, height),
            new sat_1.default.Vector(0, height),
          ];
        }
        exports.createBox = createBox;
        /**
         * ensure returns a SAT.Vector
         * @param {SAT.Vector} point
         */
        function ensureVectorPoint(point = {}) {
          return point instanceof sat_1.default.Vector
            ? point
            : new sat_1.default.Vector(point.x || 0, point.y || 0);
        }
        exports.ensureVectorPoint = ensureVectorPoint;
        /**
         * ensure correct counterclockwise points
         * @param {SAT.Vector[]} points
         */
        function ensurePolygonPoints(points) {
          if (!points) {
            throw new Error("No points array provided");
          }
          const vectorPoints = points.map(ensureVectorPoint);
          return clockwise(vectorPoints)
            ? vectorPoints.reverse()
            : vectorPoints;
        }
        exports.ensurePolygonPoints = ensurePolygonPoints;
        /**
         * get distance between two {x, y} points
         * @param {Vector} a
         * @param {Vector} b
         * @returns {number}
         */
        function distance(a, b) {
          return Math.hypot(a.x - b.x, a.y - b.y);
        }
        exports.distance = distance;
        /**
         * returns function to sort raycast results
         * @param {Vector} from
         * @returns {function}
         */
        function closest(from) {
          return ({ point: a }, { point: b }) =>
            distance(from, a) - distance(from, b);
        }
        exports.closest = closest;
        /**
         * check direction of polygon
         * @param {SAT.Vector[]} points
         */
        function clockwise(points) {
          let sum = 0;
          for (let i = 0; i < points.length; i++) {
            const v1 = points[i];
            const v2 = points[(i + 1) % points.length];
            sum += (v2.x - v1.x) * (v2.y + v1.y);
          }
          return sum > 0;
        }
        exports.clockwise = clockwise;
        /**
         * draws dashed line on canvas context
         * @param {CanvasRenderingContext2D} context
         * @param {number} fromX
         * @param {number} fromY
         * @param {number} toX
         * @param {number} toY
         * @param {number?} dash
         * @param {number?} gap
         */
        function dashLineTo(
          context,
          fromX,
          fromY,
          toX,
          toY,
          dash = 2,
          gap = 4
        ) {
          const xDiff = toX - fromX;
          const yDiff = toY - fromY;
          const arc = Math.atan2(yDiff, xDiff);
          const offsetX = Math.cos(arc);
          const offsetY = Math.sin(arc);
          let posX = fromX;
          let posY = fromY;
          let dist = Math.hypot(xDiff, yDiff);
          while (dist > 0) {
            const step = Math.min(dist, dash);
            context.moveTo(posX, posY);
            context.lineTo(posX + offsetX * step, posY + offsetY * step);
            posX += offsetX * (dash + gap);
            posY += offsetY * (dash + gap);
            dist -= dash + gap;
          }
        }
        exports.dashLineTo = dashLineTo;
      },
      { sat: 13 },
    ],
    12: [
      function (require, module, exports) {
        !(function (t, i) {
          "object" == typeof exports && "undefined" != typeof module
            ? (module.exports = i())
            : "function" == typeof define && define.amd
            ? define(i)
            : ((t = t || self).RBush = i());
        })(this, function () {
          "use strict";
          function t(t, r, e, a, h) {
            !(function t(n, r, e, a, h) {
              for (; a > e; ) {
                if (a - e > 600) {
                  var o = a - e + 1,
                    s = r - e + 1,
                    l = Math.log(o),
                    f = 0.5 * Math.exp((2 * l) / 3),
                    u =
                      0.5 *
                      Math.sqrt((l * f * (o - f)) / o) *
                      (s - o / 2 < 0 ? -1 : 1),
                    m = Math.max(e, Math.floor(r - (s * f) / o + u)),
                    c = Math.min(a, Math.floor(r + ((o - s) * f) / o + u));
                  t(n, r, m, c, h);
                }
                var p = n[r],
                  d = e,
                  x = a;
                for (i(n, e, r), h(n[a], p) > 0 && i(n, e, a); d < x; ) {
                  for (i(n, d, x), d++, x--; h(n[d], p) < 0; ) d++;
                  for (; h(n[x], p) > 0; ) x--;
                }
                0 === h(n[e], p) ? i(n, e, x) : i(n, ++x, a),
                  x <= r && (e = x + 1),
                  r <= x && (a = x - 1);
              }
            })(t, r, e || 0, a || t.length - 1, h || n);
          }
          function i(t, i, n) {
            var r = t[i];
            (t[i] = t[n]), (t[n] = r);
          }
          function n(t, i) {
            return t < i ? -1 : t > i ? 1 : 0;
          }
          var r = function (t) {
            void 0 === t && (t = 9),
              (this._maxEntries = Math.max(4, t)),
              (this._minEntries = Math.max(
                2,
                Math.ceil(0.4 * this._maxEntries)
              )),
              this.clear();
          };
          function e(t, i, n) {
            if (!n) return i.indexOf(t);
            for (var r = 0; r < i.length; r++) if (n(t, i[r])) return r;
            return -1;
          }
          function a(t, i) {
            h(t, 0, t.children.length, i, t);
          }
          function h(t, i, n, r, e) {
            e || (e = p(null)),
              (e.minX = 1 / 0),
              (e.minY = 1 / 0),
              (e.maxX = -1 / 0),
              (e.maxY = -1 / 0);
            for (var a = i; a < n; a++) {
              var h = t.children[a];
              o(e, t.leaf ? r(h) : h);
            }
            return e;
          }
          function o(t, i) {
            return (
              (t.minX = Math.min(t.minX, i.minX)),
              (t.minY = Math.min(t.minY, i.minY)),
              (t.maxX = Math.max(t.maxX, i.maxX)),
              (t.maxY = Math.max(t.maxY, i.maxY)),
              t
            );
          }
          function s(t, i) {
            return t.minX - i.minX;
          }
          function l(t, i) {
            return t.minY - i.minY;
          }
          function f(t) {
            return (t.maxX - t.minX) * (t.maxY - t.minY);
          }
          function u(t) {
            return t.maxX - t.minX + (t.maxY - t.minY);
          }
          function m(t, i) {
            return (
              t.minX <= i.minX &&
              t.minY <= i.minY &&
              i.maxX <= t.maxX &&
              i.maxY <= t.maxY
            );
          }
          function c(t, i) {
            return (
              i.minX <= t.maxX &&
              i.minY <= t.maxY &&
              i.maxX >= t.minX &&
              i.maxY >= t.minY
            );
          }
          function p(t) {
            return {
              children: t,
              height: 1,
              leaf: !0,
              minX: 1 / 0,
              minY: 1 / 0,
              maxX: -1 / 0,
              maxY: -1 / 0,
            };
          }
          function d(i, n, r, e, a) {
            for (var h = [n, r]; h.length; )
              if (!((r = h.pop()) - (n = h.pop()) <= e)) {
                var o = n + Math.ceil((r - n) / e / 2) * e;
                t(i, o, n, r, a), h.push(n, o, o, r);
              }
          }
          return (
            (r.prototype.all = function () {
              return this._all(this.data, []);
            }),
            (r.prototype.search = function (t) {
              var i = this.data,
                n = [];
              if (!c(t, i)) return n;
              for (var r = this.toBBox, e = []; i; ) {
                for (var a = 0; a < i.children.length; a++) {
                  var h = i.children[a],
                    o = i.leaf ? r(h) : h;
                  c(t, o) &&
                    (i.leaf
                      ? n.push(h)
                      : m(t, o)
                      ? this._all(h, n)
                      : e.push(h));
                }
                i = e.pop();
              }
              return n;
            }),
            (r.prototype.collides = function (t) {
              var i = this.data;
              if (!c(t, i)) return !1;
              for (var n = []; i; ) {
                for (var r = 0; r < i.children.length; r++) {
                  var e = i.children[r],
                    a = i.leaf ? this.toBBox(e) : e;
                  if (c(t, a)) {
                    if (i.leaf || m(t, a)) return !0;
                    n.push(e);
                  }
                }
                i = n.pop();
              }
              return !1;
            }),
            (r.prototype.load = function (t) {
              if (!t || !t.length) return this;
              if (t.length < this._minEntries) {
                for (var i = 0; i < t.length; i++) this.insert(t[i]);
                return this;
              }
              var n = this._build(t.slice(), 0, t.length - 1, 0);
              if (this.data.children.length)
                if (this.data.height === n.height)
                  this._splitRoot(this.data, n);
                else {
                  if (this.data.height < n.height) {
                    var r = this.data;
                    (this.data = n), (n = r);
                  }
                  this._insert(n, this.data.height - n.height - 1, !0);
                }
              else this.data = n;
              return this;
            }),
            (r.prototype.insert = function (t) {
              return t && this._insert(t, this.data.height - 1), this;
            }),
            (r.prototype.clear = function () {
              return (this.data = p([])), this;
            }),
            (r.prototype.remove = function (t, i) {
              if (!t) return this;
              for (
                var n, r, a, h = this.data, o = this.toBBox(t), s = [], l = [];
                h || s.length;

              ) {
                if (
                  (h ||
                    ((h = s.pop()),
                    (r = s[s.length - 1]),
                    (n = l.pop()),
                    (a = !0)),
                  h.leaf)
                ) {
                  var f = e(t, h.children, i);
                  if (-1 !== f)
                    return (
                      h.children.splice(f, 1),
                      s.push(h),
                      this._condense(s),
                      this
                    );
                }
                a || h.leaf || !m(h, o)
                  ? r
                    ? (n++, (h = r.children[n]), (a = !1))
                    : (h = null)
                  : (s.push(h),
                    l.push(n),
                    (n = 0),
                    (r = h),
                    (h = h.children[0]));
              }
              return this;
            }),
            (r.prototype.toBBox = function (t) {
              return t;
            }),
            (r.prototype.compareMinX = function (t, i) {
              return t.minX - i.minX;
            }),
            (r.prototype.compareMinY = function (t, i) {
              return t.minY - i.minY;
            }),
            (r.prototype.toJSON = function () {
              return this.data;
            }),
            (r.prototype.fromJSON = function (t) {
              return (this.data = t), this;
            }),
            (r.prototype._all = function (t, i) {
              for (var n = []; t; )
                t.leaf
                  ? i.push.apply(i, t.children)
                  : n.push.apply(n, t.children),
                  (t = n.pop());
              return i;
            }),
            (r.prototype._build = function (t, i, n, r) {
              var e,
                h = n - i + 1,
                o = this._maxEntries;
              if (h <= o) return a((e = p(t.slice(i, n + 1))), this.toBBox), e;
              r ||
                ((r = Math.ceil(Math.log(h) / Math.log(o))),
                (o = Math.ceil(h / Math.pow(o, r - 1)))),
                ((e = p([])).leaf = !1),
                (e.height = r);
              var s = Math.ceil(h / o),
                l = s * Math.ceil(Math.sqrt(o));
              d(t, i, n, l, this.compareMinX);
              for (var f = i; f <= n; f += l) {
                var u = Math.min(f + l - 1, n);
                d(t, f, u, s, this.compareMinY);
                for (var m = f; m <= u; m += s) {
                  var c = Math.min(m + s - 1, u);
                  e.children.push(this._build(t, m, c, r - 1));
                }
              }
              return a(e, this.toBBox), e;
            }),
            (r.prototype._chooseSubtree = function (t, i, n, r) {
              for (; r.push(i), !i.leaf && r.length - 1 !== n; ) {
                for (
                  var e = 1 / 0, a = 1 / 0, h = void 0, o = 0;
                  o < i.children.length;
                  o++
                ) {
                  var s = i.children[o],
                    l = f(s),
                    u =
                      ((m = t),
                      (c = s),
                      (Math.max(c.maxX, m.maxX) - Math.min(c.minX, m.minX)) *
                        (Math.max(c.maxY, m.maxY) - Math.min(c.minY, m.minY)) -
                        l);
                  u < a
                    ? ((a = u), (e = l < e ? l : e), (h = s))
                    : u === a && l < e && ((e = l), (h = s));
                }
                i = h || i.children[0];
              }
              var m, c;
              return i;
            }),
            (r.prototype._insert = function (t, i, n) {
              var r = n ? t : this.toBBox(t),
                e = [],
                a = this._chooseSubtree(r, this.data, i, e);
              for (
                a.children.push(t), o(a, r);
                i >= 0 && e[i].children.length > this._maxEntries;

              )
                this._split(e, i), i--;
              this._adjustParentBBoxes(r, e, i);
            }),
            (r.prototype._split = function (t, i) {
              var n = t[i],
                r = n.children.length,
                e = this._minEntries;
              this._chooseSplitAxis(n, e, r);
              var h = this._chooseSplitIndex(n, e, r),
                o = p(n.children.splice(h, n.children.length - h));
              (o.height = n.height),
                (o.leaf = n.leaf),
                a(n, this.toBBox),
                a(o, this.toBBox),
                i ? t[i - 1].children.push(o) : this._splitRoot(n, o);
            }),
            (r.prototype._splitRoot = function (t, i) {
              (this.data = p([t, i])),
                (this.data.height = t.height + 1),
                (this.data.leaf = !1),
                a(this.data, this.toBBox);
            }),
            (r.prototype._chooseSplitIndex = function (t, i, n) {
              for (
                var r, e, a, o, s, l, u, m = 1 / 0, c = 1 / 0, p = i;
                p <= n - i;
                p++
              ) {
                var d = h(t, 0, p, this.toBBox),
                  x = h(t, p, n, this.toBBox),
                  v =
                    ((e = d),
                    (a = x),
                    (o = void 0),
                    (s = void 0),
                    (l = void 0),
                    (u = void 0),
                    (o = Math.max(e.minX, a.minX)),
                    (s = Math.max(e.minY, a.minY)),
                    (l = Math.min(e.maxX, a.maxX)),
                    (u = Math.min(e.maxY, a.maxY)),
                    Math.max(0, l - o) * Math.max(0, u - s)),
                  M = f(d) + f(x);
                v < m
                  ? ((m = v), (r = p), (c = M < c ? M : c))
                  : v === m && M < c && ((c = M), (r = p));
              }
              return r || n - i;
            }),
            (r.prototype._chooseSplitAxis = function (t, i, n) {
              var r = t.leaf ? this.compareMinX : s,
                e = t.leaf ? this.compareMinY : l;
              this._allDistMargin(t, i, n, r) <
                this._allDistMargin(t, i, n, e) && t.children.sort(r);
            }),
            (r.prototype._allDistMargin = function (t, i, n, r) {
              t.children.sort(r);
              for (
                var e = this.toBBox,
                  a = h(t, 0, i, e),
                  s = h(t, n - i, n, e),
                  l = u(a) + u(s),
                  f = i;
                f < n - i;
                f++
              ) {
                var m = t.children[f];
                o(a, t.leaf ? e(m) : m), (l += u(a));
              }
              for (var c = n - i - 1; c >= i; c--) {
                var p = t.children[c];
                o(s, t.leaf ? e(p) : p), (l += u(s));
              }
              return l;
            }),
            (r.prototype._adjustParentBBoxes = function (t, i, n) {
              for (var r = n; r >= 0; r--) o(i[r], t);
            }),
            (r.prototype._condense = function (t) {
              for (var i = t.length - 1, n = void 0; i >= 0; i--)
                0 === t[i].children.length
                  ? i > 0
                    ? (n = t[i - 1].children).splice(n.indexOf(t[i]), 1)
                    : this.clear()
                  : a(t[i], this.toBBox);
            }),
            r
          );
        });
      },
      {},
    ],
    13: [
      function (require, module, exports) {
        // Version 0.9.0 - Copyright 2012 - 2021 -  Jim Riecken <jimr@jimr.ca>
        //
        // Released under the MIT License - https://github.com/jriecken/sat-js
        //
        // A simple library for determining intersections of circles and
        // polygons using the Separating Axis Theorem.
        /** @preserve SAT.js - Version 0.9.0 - Copyright 2012 - 2021 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

        /*global define: false, module: false*/
        /*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true,
  eqeqeq:true, bitwise:true, strict:true, undef:true,
  curly:true, browser:true */

        // Create a UMD wrapper for SAT. Works in:
        //
        //  - Plain browser via global SAT variable
        //  - AMD loader (like require.js)
        //  - Node.js
        //
        // The quoted properties all over the place are used so that the Closure Compiler
        // does not mangle the exposed API in advanced mode.
        /**
         * @param {*} root - The global scope
         * @param {Function} factory - Factory that creates SAT module
         */
        (function (root, factory) {
          "use strict";
          if (typeof define === "function" && define["amd"]) {
            define(factory);
          } else if (typeof exports === "object") {
            module["exports"] = factory();
          } else {
            root["SAT"] = factory();
          }
        })(this, function () {
          "use strict";

          var SAT = {};

          //
          // ## Vector
          //
          // Represents a vector in two dimensions with `x` and `y` properties.

          // Create a new Vector, optionally passing in the `x` and `y` coordinates. If
          // a coordinate is not specified, it will be set to `0`
          /**
           * @param {?number=} x The x position.
           * @param {?number=} y The y position.
           * @constructor
           */
          function Vector(x, y) {
            this["x"] = x || 0;
            this["y"] = y || 0;
          }
          SAT["Vector"] = Vector;
          // Alias `Vector` as `V`
          SAT["V"] = Vector;

          // Copy the values of another Vector into this one.
          /**
           * @param {Vector} other The other Vector.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["copy"] = Vector.prototype.copy = function (other) {
            this["x"] = other["x"];
            this["y"] = other["y"];
            return this;
          };

          // Create a new vector with the same coordinates as this on.
          /**
           * @return {Vector} The new cloned vector
           */
          Vector.prototype["clone"] = Vector.prototype.clone = function () {
            return new Vector(this["x"], this["y"]);
          };

          // Change this vector to be perpendicular to what it was before. (Effectively
          // roatates it 90 degrees in a clockwise direction)
          /**
           * @return {Vector} This for chaining.
           */
          Vector.prototype["perp"] = Vector.prototype.perp = function () {
            var x = this["x"];
            this["x"] = this["y"];
            this["y"] = -x;
            return this;
          };

          // Rotate this vector (counter-clockwise) by the specified angle (in radians).
          /**
           * @param {number} angle The angle to rotate (in radians)
           * @return {Vector} This for chaining.
           */
          Vector.prototype["rotate"] = Vector.prototype.rotate = function (
            angle
          ) {
            var x = this["x"];
            var y = this["y"];
            this["x"] = x * Math.cos(angle) - y * Math.sin(angle);
            this["y"] = x * Math.sin(angle) + y * Math.cos(angle);
            return this;
          };

          // Reverse this vector.
          /**
           * @return {Vector} This for chaining.
           */
          Vector.prototype["reverse"] = Vector.prototype.reverse = function () {
            this["x"] = -this["x"];
            this["y"] = -this["y"];
            return this;
          };

          // Normalize this vector.  (make it have length of `1`)
          /**
           * @return {Vector} This for chaining.
           */
          Vector.prototype["normalize"] = Vector.prototype.normalize =
            function () {
              var d = this.len();
              if (d > 0) {
                this["x"] = this["x"] / d;
                this["y"] = this["y"] / d;
              }
              return this;
            };

          // Add another vector to this one.
          /**
           * @param {Vector} other The other Vector.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["add"] = Vector.prototype.add = function (other) {
            this["x"] += other["x"];
            this["y"] += other["y"];
            return this;
          };

          // Subtract another vector from this one.
          /**
           * @param {Vector} other The other Vector.
           * @return {Vector} This for chaiing.
           */
          Vector.prototype["sub"] = Vector.prototype.sub = function (other) {
            this["x"] -= other["x"];
            this["y"] -= other["y"];
            return this;
          };

          // Scale this vector. An independent scaling factor can be provided
          // for each axis, or a single scaling factor that will scale both `x` and `y`.
          /**
           * @param {number} x The scaling factor in the x direction.
           * @param {?number=} y The scaling factor in the y direction.  If this
           *   is not specified, the x scaling factor will be used.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["scale"] = Vector.prototype.scale = function (x, y) {
            this["x"] *= x;
            this["y"] *= typeof y != "undefined" ? y : x;
            return this;
          };

          // Project this vector on to another vector.
          /**
           * @param {Vector} other The vector to project onto.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["project"] = Vector.prototype.project = function (
            other
          ) {
            var amt = this.dot(other) / other.len2();
            this["x"] = amt * other["x"];
            this["y"] = amt * other["y"];
            return this;
          };

          // Project this vector onto a vector of unit length. This is slightly more efficient
          // than `project` when dealing with unit vectors.
          /**
           * @param {Vector} other The unit vector to project onto.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["projectN"] = Vector.prototype.projectN = function (
            other
          ) {
            var amt = this.dot(other);
            this["x"] = amt * other["x"];
            this["y"] = amt * other["y"];
            return this;
          };

          // Reflect this vector on an arbitrary axis.
          /**
           * @param {Vector} axis The vector representing the axis.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["reflect"] = Vector.prototype.reflect = function (
            axis
          ) {
            var x = this["x"];
            var y = this["y"];
            this.project(axis).scale(2);
            this["x"] -= x;
            this["y"] -= y;
            return this;
          };

          // Reflect this vector on an arbitrary axis (represented by a unit vector). This is
          // slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
          /**
           * @param {Vector} axis The unit vector representing the axis.
           * @return {Vector} This for chaining.
           */
          Vector.prototype["reflectN"] = Vector.prototype.reflectN = function (
            axis
          ) {
            var x = this["x"];
            var y = this["y"];
            this.projectN(axis).scale(2);
            this["x"] -= x;
            this["y"] -= y;
            return this;
          };

          // Get the dot product of this vector and another.
          /**
           * @param {Vector}  other The vector to dot this one against.
           * @return {number} The dot product.
           */
          Vector.prototype["dot"] = Vector.prototype.dot = function (other) {
            return this["x"] * other["x"] + this["y"] * other["y"];
          };

          // Get the squared length of this vector.
          /**
           * @return {number} The length^2 of this vector.
           */
          Vector.prototype["len2"] = Vector.prototype.len2 = function () {
            return this.dot(this);
          };

          // Get the length of this vector.
          /**
           * @return {number} The length of this vector.
           */
          Vector.prototype["len"] = Vector.prototype.len = function () {
            return Math.sqrt(this.len2());
          };

          // ## Circle
          //
          // Represents a circle with a position and a radius.

          // Create a new circle, optionally passing in a position and/or radius. If no position
          // is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
          // have a radius of `0`.
          /**
           * @param {Vector=} pos A vector representing the position of the center of the circle
           * @param {?number=} r The radius of the circle
           * @constructor
           */
          function Circle(pos, r) {
            this["pos"] = pos || new Vector();
            this["r"] = r || 0;
            this["offset"] = new Vector();
          }
          SAT["Circle"] = Circle;

          // Compute the axis-aligned bounding box (AABB) of this Circle.
          //
          // Note: Returns a _new_ `Box` each time you call this.
          /**
           * @return {Polygon} The AABB
           */
          Circle.prototype["getAABBAsBox"] = Circle.prototype.getAABBAsBox =
            function () {
              var r = this["r"];
              var corner = this["pos"]
                .clone()
                .add(this["offset"])
                .sub(new Vector(r, r));
              return new Box(corner, r * 2, r * 2);
            };

          // Compute the axis-aligned bounding box (AABB) of this Circle.
          //
          // Note: Returns a _new_ `Polygon` each time you call this.
          /**
           * @return {Polygon} The AABB
           */
          Circle.prototype["getAABB"] = Circle.prototype.getAABB = function () {
            return this.getAABBAsBox().toPolygon();
          };

          // Set the current offset to apply to the radius.
          /**
           * @param {Vector} offset The new offset vector.
           * @return {Circle} This for chaining.
           */
          Circle.prototype["setOffset"] = Circle.prototype.setOffset =
            function (offset) {
              this["offset"] = offset;
              return this;
            };

          // ## Polygon
          //
          // Represents a *convex* polygon with any number of points (specified in counter-clockwise order)
          //
          // Note: Do _not_ manually change the `points`, `angle`, or `offset` properties. Use the
          // provided setters. Otherwise the calculated properties will not be updated correctly.
          //
          // `pos` can be changed directly.

          // Create a new polygon, passing in a position vector, and an array of points (represented
          // by vectors relative to the position vector). If no position is passed in, the position
          // of the polygon will be `(0,0)`.
          /**
           * @param {Vector=} pos A vector representing the origin of the polygon. (all other
           *   points are relative to this one)
           * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,
           *   in counter-clockwise order.
           * @constructor
           */
          function Polygon(pos, points) {
            this["pos"] = pos || new Vector();
            this["angle"] = 0;
            this["offset"] = new Vector();
            this.setPoints(points || []);
          }
          SAT["Polygon"] = Polygon;

          // Set the points of the polygon. Any consecutive duplicate points will be combined.
          //
          // Note: The points are counter-clockwise *with respect to the coordinate system*.
          // If you directly draw the points on a screen that has the origin at the top-left corner
          // it will _appear_ visually that the points are being specified clockwise. This is just
          // because of the inversion of the Y-axis when being displayed.
          /**
           * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,
           *   in counter-clockwise order.
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["setPoints"] = Polygon.prototype.setPoints =
            function (points) {
              // Only re-allocate if this is a new polygon or the number of points has changed.
              var lengthChanged =
                !this["points"] || this["points"].length !== points.length;
              if (lengthChanged) {
                var i;
                var calcPoints = (this["calcPoints"] = []);
                var edges = (this["edges"] = []);
                var normals = (this["normals"] = []);
                // Allocate the vector arrays for the calculated properties
                for (i = 0; i < points.length; i++) {
                  // Remove consecutive duplicate points
                  var p1 = points[i];
                  var p2 = i < points.length - 1 ? points[i + 1] : points[0];
                  if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {
                    points.splice(i, 1);
                    i -= 1;
                    continue;
                  }
                  calcPoints.push(new Vector());
                  edges.push(new Vector());
                  normals.push(new Vector());
                }
              }
              this["points"] = points;
              this._recalc();
              return this;
            };

          // Set the current rotation angle of the polygon.
          /**
           * @param {number} angle The current rotation angle (in radians).
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["setAngle"] = Polygon.prototype.setAngle =
            function (angle) {
              this["angle"] = angle;
              this._recalc();
              return this;
            };

          // Set the current offset to apply to the `points` before applying the `angle` rotation.
          /**
           * @param {Vector} offset The new offset vector.
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["setOffset"] = Polygon.prototype.setOffset =
            function (offset) {
              this["offset"] = offset;
              this._recalc();
              return this;
            };

          // Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
          //
          // Note: This changes the **original** points (so any `angle` will be applied on top of this rotation).
          /**
           * @param {number} angle The angle to rotate (in radians)
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["rotate"] = Polygon.prototype.rotate = function (
            angle
          ) {
            var points = this["points"];
            var len = points.length;
            for (var i = 0; i < len; i++) {
              points[i].rotate(angle);
            }
            this._recalc();
            return this;
          };

          // Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate
          // system* (i.e. `pos`).
          //
          // This is most useful to change the "center point" of a polygon. If you just want to move the whole polygon, change
          // the coordinates of `pos`.
          //
          // Note: This changes the **original** points (so any `offset` will be applied on top of this translation)
          /**
           * @param {number} x The horizontal amount to translate.
           * @param {number} y The vertical amount to translate.
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype["translate"] = Polygon.prototype.translate =
            function (x, y) {
              var points = this["points"];
              var len = points.length;
              for (var i = 0; i < len; i++) {
                points[i]["x"] += x;
                points[i]["y"] += y;
              }
              this._recalc();
              return this;
            };

          // Computes the calculated collision polygon. Applies the `angle` and `offset` to the original points then recalculates the
          // edges and normals of the collision polygon.
          /**
           * @return {Polygon} This for chaining.
           */
          Polygon.prototype._recalc = function () {
            // Calculated points - this is what is used for underlying collisions and takes into account
            // the angle/offset set on the polygon.
            var calcPoints = this["calcPoints"];
            // The edges here are the direction of the `n`th edge of the polygon, relative to
            // the `n`th point. If you want to draw a given edge from the edge value, you must
            // first translate to the position of the starting point.
            var edges = this["edges"];
            // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
            // to the position of the `n`th point. If you want to draw an edge normal, you must first
            // translate to the position of the starting point.
            var normals = this["normals"];
            // Copy the original points array and apply the offset/angle
            var points = this["points"];
            var offset = this["offset"];
            var angle = this["angle"];
            var len = points.length;
            var i;
            for (i = 0; i < len; i++) {
              var calcPoint = calcPoints[i].copy(points[i]);
              calcPoint["x"] += offset["x"];
              calcPoint["y"] += offset["y"];
              if (angle !== 0) {
                calcPoint.rotate(angle);
              }
            }
            // Calculate the edges/normals
            for (i = 0; i < len; i++) {
              var p1 = calcPoints[i];
              var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
              var e = edges[i].copy(p2).sub(p1);
              normals[i].copy(e).perp().normalize();
            }
            return this;
          };

          // Compute the axis-aligned bounding box. Any current state
          // (translations/rotations) will be applied before constructing the AABB.
          //
          // Note: Returns a _new_ `Box` each time you call this.
          /**
           * @return {Polygon} The AABB
           */
          Polygon.prototype["getAABBAsBox"] = Polygon.prototype.getAABBAsBox =
            function () {
              var points = this["calcPoints"];
              var len = points.length;
              var xMin = points[0]["x"];
              var yMin = points[0]["y"];
              var xMax = points[0]["x"];
              var yMax = points[0]["y"];
              for (var i = 1; i < len; i++) {
                var point = points[i];
                if (point["x"] < xMin) {
                  xMin = point["x"];
                } else if (point["x"] > xMax) {
                  xMax = point["x"];
                }
                if (point["y"] < yMin) {
                  yMin = point["y"];
                } else if (point["y"] > yMax) {
                  yMax = point["y"];
                }
              }
              return new Box(
                this["pos"].clone().add(new Vector(xMin, yMin)),
                xMax - xMin,
                yMax - yMin
              );
            };

          // Compute the axis-aligned bounding box. Any current state
          // (translations/rotations) will be applied before constructing the AABB.
          //
          // Note: Returns a _new_ `Polygon` each time you call this.
          /**
           * @return {Polygon} The AABB
           */
          Polygon.prototype["getAABB"] = Polygon.prototype.getAABB =
            function () {
              return this.getAABBAsBox().toPolygon();
            };

          // Compute the centroid (geometric center) of the polygon. Any current state
          // (translations/rotations) will be applied before computing the centroid.
          //
          // See https://en.wikipedia.org/wiki/Centroid#Centroid_of_a_polygon
          //
          // Note: Returns a _new_ `Vector` each time you call this.
          /**
           * @return {Vector} A Vector that contains the coordinates of the Centroid.
           */
          Polygon.prototype["getCentroid"] = Polygon.prototype.getCentroid =
            function () {
              var points = this["calcPoints"];
              var len = points.length;
              var cx = 0;
              var cy = 0;
              var ar = 0;
              for (var i = 0; i < len; i++) {
                var p1 = points[i];
                var p2 = i === len - 1 ? points[0] : points[i + 1]; // Loop around if last point
                var a = p1["x"] * p2["y"] - p2["x"] * p1["y"];
                cx += (p1["x"] + p2["x"]) * a;
                cy += (p1["y"] + p2["y"]) * a;
                ar += a;
              }
              ar = ar * 3; // we want 1 / 6 the area and we currently have 2*area
              cx = cx / ar;
              cy = cy / ar;
              return new Vector(cx, cy);
            };

          // ## Box
          //
          // Represents an axis-aligned box, with a width and height.

          // Create a new box, with the specified position, width, and height. If no position
          // is given, the position will be `(0,0)`. If no width or height are given, they will
          // be set to `0`.
          /**
           * @param {Vector=} pos A vector representing the bottom-left of the box (i.e. the smallest x and smallest y value).
           * @param {?number=} w The width of the box.
           * @param {?number=} h The height of the box.
           * @constructor
           */
          function Box(pos, w, h) {
            this["pos"] = pos || new Vector();
            this["w"] = w || 0;
            this["h"] = h || 0;
          }
          SAT["Box"] = Box;

          // Returns a polygon whose edges are the same as this box.
          /**
           * @return {Polygon} A new Polygon that represents this box.
           */
          Box.prototype["toPolygon"] = Box.prototype.toPolygon = function () {
            var pos = this["pos"];
            var w = this["w"];
            var h = this["h"];
            return new Polygon(new Vector(pos["x"], pos["y"]), [
              new Vector(),
              new Vector(w, 0),
              new Vector(w, h),
              new Vector(0, h),
            ]);
          };

          // ## Response
          //
          // An object representing the result of an intersection. Contains:
          //  - The two objects participating in the intersection
          //  - The vector representing the minimum change necessary to extract the first object
          //    from the second one (as well as a unit vector in that direction and the magnitude
          //    of the overlap)
          //  - Whether the first object is entirely inside the second, and vice versa.
          /**
           * @constructor
           */
          function Response() {
            this["a"] = null;
            this["b"] = null;
            this["overlapN"] = new Vector();
            this["overlapV"] = new Vector();
            this.clear();
          }
          SAT["Response"] = Response;

          // Set some values of the response back to their defaults.  Call this between tests if
          // you are going to reuse a single Response object for multiple intersection tests (recommented
          // as it will avoid allcating extra memory)
          /**
           * @return {Response} This for chaining
           */
          Response.prototype["clear"] = Response.prototype.clear = function () {
            this["aInB"] = true;
            this["bInA"] = true;
            this["overlap"] = Number.MAX_VALUE;
            return this;
          };

          // ## Object Pools

          // A pool of `Vector` objects that are used in calculations to avoid
          // allocating memory.
          /**
           * @type {Array<Vector>}
           */
          var T_VECTORS = [];
          for (var i = 0; i < 10; i++) {
            T_VECTORS.push(new Vector());
          }

          // A pool of arrays of numbers used in calculations to avoid allocating
          // memory.
          /**
           * @type {Array<Array<number>>}
           */
          var T_ARRAYS = [];
          for (var i = 0; i < 5; i++) {
            T_ARRAYS.push([]);
          }

          // Temporary response used for polygon hit detection.
          /**
           * @type {Response}
           */
          var T_RESPONSE = new Response();

          // Tiny "point" polygon used for polygon hit detection.
          /**
           * @type {Polygon}
           */
          var TEST_POINT = new Box(
            new Vector(),
            0.000001,
            0.000001
          ).toPolygon();

          // ## Helper Functions

          // Flattens the specified array of points onto a unit vector axis,
          // resulting in a one dimensional range of the minimum and
          // maximum value on that axis.
          /**
           * @param {Array<Vector>} points The points to flatten.
           * @param {Vector} normal The unit vector axis to flatten on.
           * @param {Array<number>} result An array.  After calling this function,
           *   result[0] will be the minimum value,
           *   result[1] will be the maximum value.
           */
          function flattenPointsOn(points, normal, result) {
            var min = Number.MAX_VALUE;
            var max = -Number.MAX_VALUE;
            var len = points.length;
            for (var i = 0; i < len; i++) {
              // The magnitude of the projection of the point onto the normal
              var dot = points[i].dot(normal);
              if (dot < min) {
                min = dot;
              }
              if (dot > max) {
                max = dot;
              }
            }
            result[0] = min;
            result[1] = max;
          }

          // Check whether two convex polygons are separated by the specified
          // axis (must be a unit vector).
          /**
           * @param {Vector} aPos The position of the first polygon.
           * @param {Vector} bPos The position of the second polygon.
           * @param {Array<Vector>} aPoints The points in the first polygon.
           * @param {Array<Vector>} bPoints The points in the second polygon.
           * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
           *   will be projected onto this axis.
           * @param {Response=} response A Response object (optional) which will be populated
           *   if the axis is not a separating axis.
           * @return {boolean} true if it is a separating axis, false otherwise.  If false,
           *   and a response is passed in, information about how much overlap and
           *   the direction of the overlap will be populated.
           */
          function isSeparatingAxis(
            aPos,
            bPos,
            aPoints,
            bPoints,
            axis,
            response
          ) {
            var rangeA = T_ARRAYS.pop();
            var rangeB = T_ARRAYS.pop();
            // The magnitude of the offset between the two polygons
            var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
            var projectedOffset = offsetV.dot(axis);
            // Project the polygons onto the axis.
            flattenPointsOn(aPoints, axis, rangeA);
            flattenPointsOn(bPoints, axis, rangeB);
            // Move B's range to its position relative to A.
            rangeB[0] += projectedOffset;
            rangeB[1] += projectedOffset;
            // Check if there is a gap. If there is, this is a separating axis and we can stop
            if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
              T_VECTORS.push(offsetV);
              T_ARRAYS.push(rangeA);
              T_ARRAYS.push(rangeB);
              return true;
            }
            // This is not a separating axis. If we're calculating a response, calculate the overlap.
            if (response) {
              var overlap = 0;
              // A starts further left than B
              if (rangeA[0] < rangeB[0]) {
                response["aInB"] = false;
                // A ends before B does. We have to pull A out of B
                if (rangeA[1] < rangeB[1]) {
                  overlap = rangeA[1] - rangeB[0];
                  response["bInA"] = false;
                  // B is fully inside A.  Pick the shortest way out.
                } else {
                  var option1 = rangeA[1] - rangeB[0];
                  var option2 = rangeB[1] - rangeA[0];
                  overlap = option1 < option2 ? option1 : -option2;
                }
                // B starts further left than A
              } else {
                response["bInA"] = false;
                // B ends before A ends. We have to push A out of B
                if (rangeA[1] > rangeB[1]) {
                  overlap = rangeA[0] - rangeB[1];
                  response["aInB"] = false;
                  // A is fully inside B.  Pick the shortest way out.
                } else {
                  var option1 = rangeA[1] - rangeB[0];
                  var option2 = rangeB[1] - rangeA[0];
                  overlap = option1 < option2 ? option1 : -option2;
                }
              }
              // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
              var absOverlap = Math.abs(overlap);
              if (absOverlap < response["overlap"]) {
                response["overlap"] = absOverlap;
                response["overlapN"].copy(axis);
                if (overlap < 0) {
                  response["overlapN"].reverse();
                }
              }
            }
            T_VECTORS.push(offsetV);
            T_ARRAYS.push(rangeA);
            T_ARRAYS.push(rangeB);
            return false;
          }
          SAT["isSeparatingAxis"] = isSeparatingAxis;

          // Calculates which Voronoi region a point is on a line segment.
          // It is assumed that both the line and the point are relative to `(0,0)`
          //
          //            |       (0)      |
          //     (-1)  [S]--------------[E]  (1)
          //            |       (0)      |
          /**
           * @param {Vector} line The line segment.
           * @param {Vector} point The point.
           * @return  {number} LEFT_VORONOI_REGION (-1) if it is the left region,
           *          MIDDLE_VORONOI_REGION (0) if it is the middle region,
           *          RIGHT_VORONOI_REGION (1) if it is the right region.
           */
          function voronoiRegion(line, point) {
            var len2 = line.len2();
            var dp = point.dot(line);
            // If the point is beyond the start of the line, it is in the
            // left voronoi region.
            if (dp < 0) {
              return LEFT_VORONOI_REGION;
            }
            // If the point is beyond the end of the line, it is in the
            // right voronoi region.
            else if (dp > len2) {
              return RIGHT_VORONOI_REGION;
            }
            // Otherwise, it's in the middle one.
            else {
              return MIDDLE_VORONOI_REGION;
            }
          }
          // Constants for Voronoi regions
          /**
           * @const
           */
          var LEFT_VORONOI_REGION = -1;
          /**
           * @const
           */
          var MIDDLE_VORONOI_REGION = 0;
          /**
           * @const
           */
          var RIGHT_VORONOI_REGION = 1;

          // ## Collision Tests

          // Check if a point is inside a circle.
          /**
           * @param {Vector} p The point to test.
           * @param {Circle} c The circle to test.
           * @return {boolean} true if the point is inside the circle, false if it is not.
           */
          function pointInCircle(p, c) {
            var differenceV = T_VECTORS.pop()
              .copy(p)
              .sub(c["pos"])
              .sub(c["offset"]);
            var radiusSq = c["r"] * c["r"];
            var distanceSq = differenceV.len2();
            T_VECTORS.push(differenceV);
            // If the distance between is smaller than the radius then the point is inside the circle.
            return distanceSq <= radiusSq;
          }
          SAT["pointInCircle"] = pointInCircle;

          // Check if a point is inside a convex polygon.
          /**
           * @param {Vector} p The point to test.
           * @param {Polygon} poly The polygon to test.
           * @return {boolean} true if the point is inside the polygon, false if it is not.
           */
          function pointInPolygon(p, poly) {
            TEST_POINT["pos"].copy(p);
            T_RESPONSE.clear();
            var result = testPolygonPolygon(TEST_POINT, poly, T_RESPONSE);
            if (result) {
              result = T_RESPONSE["aInB"];
            }
            return result;
          }
          SAT["pointInPolygon"] = pointInPolygon;

          // Check if two circles collide.
          /**
           * @param {Circle} a The first circle.
           * @param {Circle} b The second circle.
           * @param {Response=} response Response object (optional) that will be populated if
           *   the circles intersect.
           * @return {boolean} true if the circles intersect, false if they don't.
           */
          function testCircleCircle(a, b, response) {
            // Check if the distance between the centers of the two
            // circles is greater than their combined radius.
            var differenceV = T_VECTORS.pop()
              .copy(b["pos"])
              .add(b["offset"])
              .sub(a["pos"])
              .sub(a["offset"]);
            var totalRadius = a["r"] + b["r"];
            var totalRadiusSq = totalRadius * totalRadius;
            var distanceSq = differenceV.len2();
            // If the distance is bigger than the combined radius, they don't intersect.
            if (distanceSq > totalRadiusSq) {
              T_VECTORS.push(differenceV);
              return false;
            }
            // They intersect.  If we're calculating a response, calculate the overlap.
            if (response) {
              var dist = Math.sqrt(distanceSq);
              response["a"] = a;
              response["b"] = b;
              response["overlap"] = totalRadius - dist;
              response["overlapN"].copy(differenceV.normalize());
              response["overlapV"].copy(differenceV).scale(response["overlap"]);
              response["aInB"] = a["r"] <= b["r"] && dist <= b["r"] - a["r"];
              response["bInA"] = b["r"] <= a["r"] && dist <= a["r"] - b["r"];
            }
            T_VECTORS.push(differenceV);
            return true;
          }
          SAT["testCircleCircle"] = testCircleCircle;

          // Check if a polygon and a circle collide.
          /**
           * @param {Polygon} polygon The polygon.
           * @param {Circle} circle The circle.
           * @param {Response=} response Response object (optional) that will be populated if
           *   they interset.
           * @return {boolean} true if they intersect, false if they don't.
           */
          function testPolygonCircle(polygon, circle, response) {
            // Get the position of the circle relative to the polygon.
            var circlePos = T_VECTORS.pop()
              .copy(circle["pos"])
              .add(circle["offset"])
              .sub(polygon["pos"]);
            var radius = circle["r"];
            var radius2 = radius * radius;
            var points = polygon["calcPoints"];
            var len = points.length;
            var edge = T_VECTORS.pop();
            var point = T_VECTORS.pop();

            // For each edge in the polygon:
            for (var i = 0; i < len; i++) {
              var next = i === len - 1 ? 0 : i + 1;
              var prev = i === 0 ? len - 1 : i - 1;
              var overlap = 0;
              var overlapN = null;

              // Get the edge.
              edge.copy(polygon["edges"][i]);
              // Calculate the center of the circle relative to the starting point of the edge.
              point.copy(circlePos).sub(points[i]);

              // If the distance between the center of the circle and the point
              // is bigger than the radius, the polygon is definitely not fully in
              // the circle.
              if (response && point.len2() > radius2) {
                response["aInB"] = false;
              }

              // Calculate which Voronoi region the center of the circle is in.
              var region = voronoiRegion(edge, point);
              // If it's the left region:
              if (region === LEFT_VORONOI_REGION) {
                // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.
                edge.copy(polygon["edges"][prev]);
                // Calculate the center of the circle relative the starting point of the previous edge
                var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
                region = voronoiRegion(edge, point2);
                if (region === RIGHT_VORONOI_REGION) {
                  // It's in the region we want.  Check if the circle intersects the point.
                  var dist = point.len();
                  if (dist > radius) {
                    // No intersection
                    T_VECTORS.push(circlePos);
                    T_VECTORS.push(edge);
                    T_VECTORS.push(point);
                    T_VECTORS.push(point2);
                    return false;
                  } else if (response) {
                    // It intersects, calculate the overlap.
                    response["bInA"] = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                  }
                }
                T_VECTORS.push(point2);
                // If it's the right region:
              } else if (region === RIGHT_VORONOI_REGION) {
                // We need to make sure we're in the left region on the next edge
                edge.copy(polygon["edges"][next]);
                // Calculate the center of the circle relative to the starting point of the next edge.
                point.copy(circlePos).sub(points[next]);
                region = voronoiRegion(edge, point);
                if (region === LEFT_VORONOI_REGION) {
                  // It's in the region we want.  Check if the circle intersects the point.
                  var dist = point.len();
                  if (dist > radius) {
                    // No intersection
                    T_VECTORS.push(circlePos);
                    T_VECTORS.push(edge);
                    T_VECTORS.push(point);
                    return false;
                  } else if (response) {
                    // It intersects, calculate the overlap.
                    response["bInA"] = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                  }
                }
                // Otherwise, it's the middle region:
              } else {
                // Need to check if the circle is intersecting the edge,
                // Change the edge into its "edge normal".
                var normal = edge.perp().normalize();
                // Find the perpendicular distance between the center of the
                // circle and the edge.
                var dist = point.dot(normal);
                var distAbs = Math.abs(dist);
                // If the circle is on the outside of the edge, there is no intersection.
                if (dist > 0 && distAbs > radius) {
                  // No intersection
                  T_VECTORS.push(circlePos);
                  T_VECTORS.push(normal);
                  T_VECTORS.push(point);
                  return false;
                } else if (response) {
                  // It intersects, calculate the overlap.
                  overlapN = normal;
                  overlap = radius - dist;
                  // If the center of the circle is on the outside of the edge, or part of the
                  // circle is on the outside, the circle is not fully inside the polygon.
                  if (dist >= 0 || overlap < 2 * radius) {
                    response["bInA"] = false;
                  }
                }
              }

              // If this is the smallest overlap we've seen, keep it.
              // (overlapN may be null if the circle was in the wrong Voronoi region).
              if (
                overlapN &&
                response &&
                Math.abs(overlap) < Math.abs(response["overlap"])
              ) {
                response["overlap"] = overlap;
                response["overlapN"].copy(overlapN);
              }
            }

            // Calculate the final overlap vector - based on the smallest overlap.
            if (response) {
              response["a"] = polygon;
              response["b"] = circle;
              response["overlapV"]
                .copy(response["overlapN"])
                .scale(response["overlap"]);
            }
            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);
            return true;
          }
          SAT["testPolygonCircle"] = testPolygonCircle;

          // Check if a circle and a polygon collide.
          //
          // **NOTE:** This is slightly less efficient than polygonCircle as it just
          // runs polygonCircle and reverses everything at the end.
          /**
           * @param {Circle} circle The circle.
           * @param {Polygon} polygon The polygon.
           * @param {Response=} response Response object (optional) that will be populated if
           *   they interset.
           * @return {boolean} true if they intersect, false if they don't.
           */
          function testCirclePolygon(circle, polygon, response) {
            // Test the polygon against the circle.
            var result = testPolygonCircle(polygon, circle, response);
            if (result && response) {
              // Swap A and B in the response.
              var a = response["a"];
              var aInB = response["aInB"];
              response["overlapN"].reverse();
              response["overlapV"].reverse();
              response["a"] = response["b"];
              response["b"] = a;
              response["aInB"] = response["bInA"];
              response["bInA"] = aInB;
            }
            return result;
          }
          SAT["testCirclePolygon"] = testCirclePolygon;

          // Checks whether polygons collide.
          /**
           * @param {Polygon} a The first polygon.
           * @param {Polygon} b The second polygon.
           * @param {Response=} response Response object (optional) that will be populated if
           *   they interset.
           * @return {boolean} true if they intersect, false if they don't.
           */
          function testPolygonPolygon(a, b, response) {
            var aPoints = a["calcPoints"];
            var aLen = aPoints.length;
            var bPoints = b["calcPoints"];
            var bLen = bPoints.length;
            // If any of the edge normals of A is a separating axis, no intersection.
            for (var i = 0; i < aLen; i++) {
              if (
                isSeparatingAxis(
                  a["pos"],
                  b["pos"],
                  aPoints,
                  bPoints,
                  a["normals"][i],
                  response
                )
              ) {
                return false;
              }
            }
            // If any of the edge normals of B is a separating axis, no intersection.
            for (var i = 0; i < bLen; i++) {
              if (
                isSeparatingAxis(
                  a["pos"],
                  b["pos"],
                  aPoints,
                  bPoints,
                  b["normals"][i],
                  response
                )
              ) {
                return false;
              }
            }
            // Since none of the edge normals of A or B are a separating axis, there is an intersection
            // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
            // final overlap vector.
            if (response) {
              response["a"] = a;
              response["b"] = b;
              response["overlapV"]
                .copy(response["overlapN"])
                .scale(response["overlap"]);
            }
            return true;
          }
          SAT["testPolygonPolygon"] = testPolygonPolygon;

          return SAT;
        });
      },
      {},
    ],
  },
  {},
  [1]
);
