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
        (function (global) {
          (function () {
            const DetectCollisions = require("detect-collisions");
            global.DetectCollisions = DetectCollisions;
          }.call(this));
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      { "detect-collisions": 6 },
    ],
    2: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.Box = undefined;

        var _slicedToArray = (function () {
          function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;
            try {
              for (
                var _i = arr[Symbol.iterator](), _s;
                !(_n = (_s = _i.next()).done);
                _n = true
              ) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
              }
            } catch (err) {
              _d = true;
              _e = err;
            } finally {
              try {
                if (!_n && _i["return"]) _i["return"]();
              } finally {
                if (_d) throw _e;
              }
            }
            return _arr;
          }
          return function (arr, i) {
            if (Array.isArray(arr)) {
              return arr;
            } else if (Symbol.iterator in Object(arr)) {
              return sliceIterator(arr, i);
            } else {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance"
              );
            }
          };
        })();

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var _sat = require("sat");

        var _sat2 = _interopRequireDefault(_sat);

        var _model = require("../model");

        var _utils = require("../utils");

        var _polygon = require("./polygon");

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          }
          return call &&
            (typeof call === "object" || typeof call === "function")
            ? call
            : self;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof superClass
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass);
        }

        /**
         * collider - box
         */
        var Box = (exports.Box = (function (_SAT$Polygon) {
          _inherits(Box, _SAT$Polygon);

          /**
           * collider - box
           * @param {Vector} position {x, y}
           * @param {number} width
           * @param {number} height
           */
          function Box(position, width, height) {
            _classCallCheck(this, Box);

            var _this = _possibleConstructorReturn(
              this,
              (Box.__proto__ || Object.getPrototypeOf(Box)).call(
                this,
                (0, _utils.ensureVectorPoint)(position),
                (0, _utils.createBox)(width, height)
              )
            );

            _this.type = _model.Types.Box;
            _this.updateAABB();
            return _this;
          }
          /**
           * Updates Bounding Box of collider
           */

          _createClass(Box, [
            {
              key: "updateAABB",
              value: function updateAABB() {
                var _calcPoints = _slicedToArray(this.calcPoints, 3),
                  topLeft = _calcPoints[0],
                  _ = _calcPoints[1],
                  topRight = _calcPoints[2];

                this.minX = this.pos.x + topLeft.x;
                this.minY = this.pos.y + topLeft.y;
                this.maxX = this.pos.x + topRight.x;
                this.maxY = this.pos.y + topRight.y;
              },
              /**
               * Draws collider on a CanvasRenderingContext2D's current path
               * @param {CanvasRenderingContext2D} context The canvas context to draw on
               */
            },
            {
              key: "draw",
              value: function draw(context) {
                _polygon.Polygon.prototype.draw.call(this, context);
              },
            },
          ]);

          return Box;
        })(_sat2.default.Polygon));
      },
      { "../model": 7, "../utils": 9, "./polygon": 5, sat: 11 },
    ],
    3: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.Circle = undefined;

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var _sat = require("sat");

        var _sat2 = _interopRequireDefault(_sat);

        var _model = require("../model");

        var _utils = require("../utils");

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          }
          return call &&
            (typeof call === "object" || typeof call === "function")
            ? call
            : self;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof superClass
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass);
        }

        /**
         * collider - circle
         */
        var Circle = (exports.Circle = (function (_SAT$Circle) {
          _inherits(Circle, _SAT$Circle);

          /**
           * collider - circle
           * @param {Vector} position {x, y}
           * @param {number} radius
           */
          function Circle(position, radius) {
            _classCallCheck(this, Circle);

            var _this = _possibleConstructorReturn(
              this,
              (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(
                this,
                (0, _utils.ensureVectorPoint)(position),
                radius
              )
            );

            _this.type = _model.Types.Circle;
            _this.updateAABB();
            return _this;
          }
          /**
           * Updates Bounding Box of collider
           */

          _createClass(Circle, [
            {
              key: "updateAABB",
              value: function updateAABB() {
                this.minX = this.pos.x - this.r;
                this.minY = this.pos.y - this.r;
                this.maxX = this.pos.x + this.r;
                this.maxY = this.pos.y + this.r;
              },
              /**
               * Draws collider on a CanvasRenderingContext2D's current path
               * @param {CanvasRenderingContext2D} context The canvas context to draw on
               */
            },
            {
              key: "draw",
              value: function draw(context) {
                var x = this.pos.x;
                var y = this.pos.y;
                var radius = this.r;
                context.moveTo(x + radius, y);
                context.arc(x, y, radius, 0, Math.PI * 2);
              },
            },
          ]);

          return Circle;
        })(_sat2.default.Circle));
      },
      { "../model": 7, "../utils": 9, sat: 11 },
    ],
    4: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.Point = undefined;

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var _sat = require("sat");

        var _sat2 = _interopRequireDefault(_sat);

        var _box = require("./box");

        var _model = require("../model");

        var _utils = require("../utils");

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          }
          return call &&
            (typeof call === "object" || typeof call === "function")
            ? call
            : self;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof superClass
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass);
        }

        /**
         * collider - point (very tiny box)
         */
        var Point = (exports.Point = (function (_SAT$Polygon) {
          _inherits(Point, _SAT$Polygon);

          /**
           * collider - point (very tiny box)
           * @param {Vector} position {x, y}
           */
          function Point(position) {
            _classCallCheck(this, Point);

            var _this = _possibleConstructorReturn(
              this,
              (Point.__proto__ || Object.getPrototypeOf(Point)).call(
                this,
                (0, _utils.ensureVectorPoint)(position),
                (0, _utils.createBox)(0.1, 0.1)
              )
            );

            _this.type = _model.Types.Point;
            _this.updateAABB();
            return _this;
          }
          /**
           * Updates Bounding Box of collider
           */

          _createClass(Point, [
            {
              key: "updateAABB",
              value: function updateAABB() {
                _box.Box.prototype.updateAABB.call(this);
              },
              /**
               * Draws collider on a CanvasRenderingContext2D's current path
               * @param {CanvasRenderingContext2D} context The canvas context to draw on
               */
            },
            {
              key: "draw",
              value: function draw(context) {
                _box.Box.prototype.draw.call(this, context);
              },
            },
          ]);

          return Point;
        })(_sat2.default.Polygon));
      },
      { "../model": 7, "../utils": 9, "./box": 2, sat: 11 },
    ],
    5: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.Polygon = undefined;

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var _sat = require("sat");

        var _sat2 = _interopRequireDefault(_sat);

        var _model = require("../model");

        var _utils = require("../utils");

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          }
          return call &&
            (typeof call === "object" || typeof call === "function")
            ? call
            : self;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof superClass
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass);
        }

        /**
         * collider - polygon
         */
        var Polygon = (exports.Polygon = (function (_SAT$Polygon) {
          _inherits(Polygon, _SAT$Polygon);

          /**
           * collider - polygon
           * @param {Vector} position {x, y}
           * @param {Vector[]} points
           */
          function Polygon(position, points) {
            _classCallCheck(this, Polygon);

            var _this = _possibleConstructorReturn(
              this,
              (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(
                this,
                (0, _utils.ensureVectorPoint)(position),
                (0, _utils.ensurePolygonPoints)(points)
              )
            );

            _this.type = _model.Types.Polygon;
            _this.updateAABB();
            return _this;
          }
          /**
           * Updates Bounding Box of collider
           */

          _createClass(Polygon, [
            {
              key: "updateAABB",
              value: function updateAABB() {
                var _getAABBAsBox = this.getAABBAsBox(),
                  pos = _getAABBAsBox.pos,
                  w = _getAABBAsBox.w,
                  h = _getAABBAsBox.h;

                this.minX = pos.x;
                this.minY = pos.y;
                this.maxX = pos.x + w;
                this.maxY = pos.y + h;
              },
              /**
               * Draws collider on a CanvasRenderingContext2D's current path
               * @param {CanvasRenderingContext2D} context The canvas context to draw on
               */
            },
            {
              key: "draw",
              value: function draw(context) {
                var _this2 = this;

                this.calcPoints.forEach(function (point, index) {
                  var posX = _this2.pos.x + point.x;
                  var posY = _this2.pos.y + point.y;
                  if (!index) {
                    if (_this2.calcPoints.length === 1) {
                      context.arc(posX, posY, 1, 0, Math.PI * 2);
                    } else {
                      context.moveTo(posX, posY);
                    }
                  } else {
                    context.lineTo(posX, posY);
                  }
                });
                if (this.calcPoints.length > 2) {
                  context.lineTo(
                    this.pos.x + this.calcPoints[0].x,
                    this.pos.y + this.calcPoints[0].y
                  );
                }
              },
            },
          ]);

          return Polygon;
        })(_sat2.default.Polygon));
      },
      { "../model": 7, "../utils": 9, sat: 11 },
    ],
    6: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _model = require("./model");

        Object.keys(_model).forEach(function (key) {
          if (key === "default" || key === "__esModule") return;
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: function get() {
              return _model[key];
            },
          });
        });

        var _circle = require("./bodies/circle");

        Object.keys(_circle).forEach(function (key) {
          if (key === "default" || key === "__esModule") return;
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: function get() {
              return _circle[key];
            },
          });
        });

        var _polygon = require("./bodies/polygon");

        Object.keys(_polygon).forEach(function (key) {
          if (key === "default" || key === "__esModule") return;
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: function get() {
              return _polygon[key];
            },
          });
        });

        var _box = require("./bodies/box");

        Object.keys(_box).forEach(function (key) {
          if (key === "default" || key === "__esModule") return;
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: function get() {
              return _box[key];
            },
          });
        });

        var _point = require("./bodies/point");

        Object.keys(_point).forEach(function (key) {
          if (key === "default" || key === "__esModule") return;
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: function get() {
              return _point[key];
            },
          });
        });

        var _system = require("./system");

        Object.keys(_system).forEach(function (key) {
          if (key === "default" || key === "__esModule") return;
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: function get() {
              return _system[key];
            },
          });
        });
      },
      {
        "./bodies/box": 2,
        "./bodies/circle": 3,
        "./bodies/point": 4,
        "./bodies/polygon": 5,
        "./model": 7,
        "./system": 8,
      },
    ],
    7: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _sat = require("sat");

        Object.defineProperty(exports, "Response", {
          enumerable: true,
          get: function get() {
            return _sat.Response;
          },
        });

        /**
         * types
         */
        var Types = (exports.Types = undefined);
        (function (Types) {
          Types["Circle"] = "Circle";
          Types["Box"] = "Box";
          Types["Point"] = "Point";
          Types["Polygon"] = "Polygon";
        })(Types || (exports.Types = Types = {}));
      },
      { sat: 11 },
    ],
    8: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.System = undefined;

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var _sat = require("sat");

        var _sat2 = _interopRequireDefault(_sat);

        var _rbush = require("rbush");

        var _rbush2 = _interopRequireDefault(_rbush);

        var _model = require("./model");

        var _box = require("./bodies/box");

        var _circle = require("./bodies/circle");

        var _polygon = require("./bodies/polygon");

        var _point = require("./bodies/point");

        var _utils = require("./utils");

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _possibleConstructorReturn(self, call) {
          if (!self) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          }
          return call &&
            (typeof call === "object" || typeof call === "function")
            ? call
            : self;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof superClass
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass)
            Object.setPrototypeOf
              ? Object.setPrototypeOf(subClass, superClass)
              : (subClass.__proto__ = superClass);
        }

        /**
         * collision system
         */
        var System = (exports.System = (function (_RBush) {
          _inherits(System, _RBush);

          function System() {
            _classCallCheck(this, System);

            var _this = _possibleConstructorReturn(
              this,
              (System.__proto__ || Object.getPrototypeOf(System)).apply(
                this,
                arguments
              )
            );

            _this.response = new _sat2.default.Response();
            return _this;
          }
          /**
           * draw bodies
           * @param {CanvasRenderingContext2D} context
           */

          _createClass(System, [
            {
              key: "draw",
              value: function draw(context) {
                this.all().forEach(function (body) {
                  body.draw(context);
                });
              },
              /**
               * draw hierarchy
               * @param {CanvasRenderingContext2D} context
               */
            },
            {
              key: "drawBVH",
              value: function drawBVH(context) {
                this.data.children.forEach(function (_ref) {
                  var minX = _ref.minX,
                    maxX = _ref.maxX,
                    minY = _ref.minY,
                    maxY = _ref.maxY;

                  _polygon.Polygon.prototype.draw.call(
                    {
                      pos: { x: minX, y: minY },
                      calcPoints: (0, _utils.createBox)(
                        maxX - minX,
                        maxY - minY
                      ),
                    },
                    context
                  );
                });
                this.all().forEach(function (body) {
                  var _body$getAABBAsBox = body.getAABBAsBox(),
                    pos = _body$getAABBAsBox.pos,
                    w = _body$getAABBAsBox.w,
                    h = _body$getAABBAsBox.h;

                  _polygon.Polygon.prototype.draw.call(
                    {
                      pos: pos,
                      calcPoints: (0, _utils.createBox)(w, h),
                    },
                    context
                  );
                });
              },
              /**
               * update body aabb and in tree
               * @param {object} body
               */
            },
            {
              key: "updateBody",
              value: function updateBody(body) {
                this.remove(body);
                body.updateAABB();
                this.insert(body);
              },
              /**
               * update all bodies aabb
               */
            },
            {
              key: "update",
              value: function update() {
                var _this2 = this;

                this.all().forEach(function (body) {
                  // no need to every cycle update static body aabb
                  if (!body.isStatic) {
                    _this2.updateBody(body);
                  }
                });
              },
              /**
               * separate (move away) colliders
               */
            },
            {
              key: "separate",
              value: function separate() {
                var _this3 = this;

                this.checkAll(function (response) {
                  // static bodies and triggers do not move back / separate
                  if (response.a.isTrigger) {
                    return;
                  }
                  response.a.pos.x -= response.overlapV.x;
                  response.a.pos.y -= response.overlapV.y;
                  _this3.updateBody(response.a);
                });
              },
              /**
               * check one collider collisions with callback
               * @param {function} callback
               */
            },
            {
              key: "checkOne",
              value: function checkOne(body, callback) {
                var _this4 = this;

                // no need to check static body collision
                if (body.isStatic) {
                  return;
                }
                this.getPotentials(body).forEach(function (candidate) {
                  if (_this4.checkCollision(body, candidate)) {
                    callback(_this4.response);
                  }
                });
              },
              /**
               * check all colliders collisions with callback
               * @param {function} callback
               */
            },
            {
              key: "checkAll",
              value: function checkAll(callback) {
                var _this5 = this;

                this.all().forEach(function (body) {
                  _this5.checkOne(body, callback);
                });
              },
              /**
               * get object potential colliders
               * @param {object} collider
               */
            },
            {
              key: "getPotentials",
              value: function getPotentials(body) {
                // filter here is required as collides with self
                return this.search(body).filter(function (candidate) {
                  return candidate !== body;
                });
              },
              /**
               * check do 2 objects collide
               * @param {object} collider
               * @param {object} candidate
               */
            },
            {
              key: "checkCollision",
              value: function checkCollision(body, candidate) {
                this.response.clear();
                if (
                  body.type === _model.Types.Circle &&
                  candidate.type === _model.Types.Circle
                ) {
                  return _sat2.default.testCircleCircle(
                    body,
                    candidate,
                    this.response
                  );
                }
                if (
                  body.type === _model.Types.Circle &&
                  candidate.type !== _model.Types.Circle
                ) {
                  return _sat2.default.testCirclePolygon(
                    body,
                    candidate,
                    this.response
                  );
                }
                if (
                  body.type !== _model.Types.Circle &&
                  candidate.type === _model.Types.Circle
                ) {
                  return _sat2.default.testPolygonCircle(
                    body,
                    candidate,
                    this.response
                  );
                }
                if (
                  body.type !== _model.Types.Circle &&
                  candidate.type !== _model.Types.Circle
                ) {
                  return _sat2.default.testPolygonPolygon(
                    body,
                    candidate,
                    this.response
                  );
                }
              },
              /**
               * create point
               * @param {Vector} position {x, y}
               */
            },
            {
              key: "createPoint",
              value: function createPoint(position) {
                var point = new _point.Point(position);
                this.insert(point);
                return point;
              },
              /**
               * create circle
               * @param {Vector} position {x, y}
               * @param {number} radius
               */
            },
            {
              key: "createCircle",
              value: function createCircle(position, radius) {
                var circle = new _circle.Circle(position, radius);
                this.insert(circle);
                return circle;
              },
              /**
               * create box
               * @param {Vector} position {x, y}
               * @param {number} width
               * @param {number} height
               * @param {number} angle
               */
            },
            {
              key: "createBox",
              value: function createBox(position, width, height) {
                var angle =
                  arguments.length > 3 && arguments[3] !== undefined
                    ? arguments[3]
                    : 0;

                var box = new _box.Box(position, width, height);
                box.setAngle(angle);
                this.insert(box);
                return box;
              },
              /**
               * create polygon
               * @param {Vector} position {x, y}
               * @param {Vector[]} points
               * @param {number} angle
               */
            },
            {
              key: "createPolygon",
              value: function createPolygon(position, points) {
                var angle =
                  arguments.length > 2 && arguments[2] !== undefined
                    ? arguments[2]
                    : 0;

                var polygon = new _polygon.Polygon(position, points);
                polygon.setAngle(angle);
                this.insert(polygon);
                return polygon;
              },
            },
          ]);

          return System;
        })(_rbush2.default));
      },
      {
        "./bodies/box": 2,
        "./bodies/circle": 3,
        "./bodies/point": 4,
        "./bodies/polygon": 5,
        "./model": 7,
        "./utils": 9,
        rbush: 10,
        sat: 11,
      },
    ],
    9: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.createBox = createBox;
        exports.ensureVectorPoint = ensureVectorPoint;
        exports.ensurePolygonPoints = ensurePolygonPoints;
        exports.clockwise = clockwise;

        var _sat = require("sat");

        var _sat2 = _interopRequireDefault(_sat);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        /**
         * creates box polygon points
         * @param {number} width
         * @param {number} height
         * @returns SAT.Vector
         */
        function createBox(width, height) {
          return [
            new _sat2.default.Vector(),
            new _sat2.default.Vector(width, 0),
            new _sat2.default.Vector(width, height),
            new _sat2.default.Vector(0, height),
          ];
        }
        /**
         * ensure returns a SAT.Vector
         * @param {SAT.Vector} point
         */
        function ensureVectorPoint(point) {
          return point instanceof _sat2.default.Vector
            ? point
            : new _sat2.default.Vector(point.x, point.y);
        }
        /**
         * ensure correct counterclockwise points
         * @param {SAT.Vector[]} points
         */
        function ensurePolygonPoints(points) {
          return (clockwise(points) ? points.reverse() : points).map(
            ensureVectorPoint
          );
        }
        /**
         * check direction of polygon
         * @param {SAT.Vector[]} points
         */
        function clockwise(points) {
          var sum = 0;
          for (var i = 0; i < points.length; i++) {
            var v1 = points[i];
            var v2 = points[(i + 1) % points.length];
            sum += (v2.x - v1.x) * (v2.y + v1.y);
          }
          return sum > 0;
        }
      },
      { sat: 11 },
    ],
    10: [
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
    11: [
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
