~function(global) {
  const Pax = {}
  Pax.baseRequire = typeof require !== "undefined" ? require : n => {
    throw new Error(`Could not resolve module name: ${n}`)
  }
  Pax.ignored = () => {}
  Pax.ignored.deps = {}
  Pax.ignored.filename = ''
  Pax.modules = {}
  Pax.files = {}
  Pax.mains = {}
  Pax.resolve = (base, then) => {
    base = base.split('/')
    base.shift()
    for (const p of then.split('/')) {
      if (p === '..') base.pop()
      else if (p !== '.') base.push(p)
    }
    return '/' + base.join('/')
  }
  Pax.Module = function Module(filename, parent) {
    this.filename = filename
    this.id = filename
    this.loaded = false
    this.parent = parent
    this.children = []
    this.exports = {}
  }
  Pax.makeRequire = self => {
    const require = m => require._module(m).exports
    require._deps = {}
    require.main = self

    require._esModule = m => {
      const mod = require._module(m)
      return mod.exports.__esModule ? mod.exports : {
        get default() {return mod.exports},
      }
    }
    require._module = m => {
      let fn = self ? require._deps[m] : Pax.main
      if (fn == null) {
        const module = {exports: Pax.baseRequire(m)}
        require._deps[m] = {module: module}
        return module
      }
      if (fn.module) return fn.module
      const module = new Pax.Module(fn.filename, self)
      fn.module = module
      module.require = Pax.makeRequire(module)
      module.require._deps = fn.deps
      module.require.main = self ? self.require.main : module
      if (self) self.children.push(module)
      fn(module, module.exports, module.require, fn.filename, fn.filename.split('/').slice(0, -1).join('/'), {url: 'file://' + (fn.filename.charAt(0) === '/' ? '' : '/') + fn.filename})
      module.loaded = true
      return module
    }
    return require
  }

  Pax.files["c:/btsync/sg/rayweekend/draw.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs.deps = {"./ray":file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs,"./vec":file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs}; file_c$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs.filename = "c:/btsync/sg/rayweekend/draw.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./vec')
  const __module1 = require._esModule('./ray')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    Vec: {get() {return __module0.Vec}, enumerable: true},
    Ray: {get() {return __module1.Ray}, enumerable: true},
  }))
}()) ~function() {
'use strict';
Object.defineProperties(exports, {
  draw: {get() {return draw}, enumerable: true},
});

     ;
     ;
 function draw(ctx, scene, userSettings) {
    const started = new Date().getTime();
    clearCanvas(ctx, scene.dimu, scene.dimv);
    const origin = scene.camera.origin;
    const dir = scene.camera.direction.normalize();
    const up = scene.up.normalize();
    const viewportRight = dir.cross(up).normalize();
    const viewportCenter = origin.add(dir.scale(scene.fov));
    // upper left corner of the viewport in world coordinate system
    const upperLeft = viewportCenter.add(viewportRight.neg(), up);
    // such that upperLeft + vvec + vvec = new Vec(-upperLeft.x, -upperLeft.y, upperLeft.z),
    // i.e. the right lower corner
    const uvec = viewportCenter.add(viewportRight.scale(userSettings.uvecX)).setZ(0);
    const vvec = viewportCenter.add(up.scale(userSettings.vvecY).neg()).setZ(0);
    console.log({ upperLeft, uvec, vvec, viewportRight, viewportCenter });
    for (let u = 0; u < scene.dimu; u += 1) {
        for (let v = 0; v < scene.dimv; v += 1) {
            const ur = u / scene.dimu; // [0;1)
            const vr = v / scene.dimv; // [0;1)
            // a ray from the camera to a pixel in the viewport
            const tracedRay = new Ray(origin, upperLeft.add(uvec.scale(ur), vvec.scale(vr)));
            const color = getColor(scene, tracedRay);
            drawPixel(ctx, u, v, color);
        }
    }
    console.log(`drawing done: ${new Date().getTime() - started} ms`);
}
function getColor(scene, tracedRay) {
    let closestHit = null;
    for (const obj of scene.objects) {
        const hit = obj.hitByRay(tracedRay);
        if (hit) {
            if (!closestHit ||
                closestHit.hitPoint.length > hit.hitPoint.length) {
                closestHit = hit;
            }
        }
    }
    if (closestHit) {
        return new Vec(closestHit.hitPointNormal.x + 1, closestHit.hitPointNormal.y + 1, closestHit.hitPointNormal.z + 1, 0)
            .scale(0.5);
    }
    // background: hyperbolic gradient
    // among all rays that hit the viewport at a given v', the one with the highest
    // normalized abs(y) is the one with x = 0 (the one going directly towards the viewport)
    // all vectors from the origin have the same non-normalized y (=v'), divided by a length
    // >= sqrt(v'^2 + z^2), with equality only when x = 0
    //
    // imagine a cone with a vertex at the origin (i.e. rays with a given 'y') intersecting a
    // plane (the viewport plane) - you get a hyperbola
    //
    // v' = y/sqrt(x^2 + y^2 + z'^2) (z' and v' are parameters)
    // v'^2*z'^2 = y^2*(1-v'^2) - x^2 (which is a hyperbolic formula)
    // y = +/- sqrt(param + x^2)/param => y has maximum abs when x = 0
    //
    // this is why the resulting gradient is dimmest in the middle and gets brighter at the sides
    // (bottom half), or is brightest in the middle and dims towards the sides (top half)
    // - points with equal lumosity are on a hyperbola with vertex in the vertical midline
    // of the viewport
    //
    // among rays with x=0, the highest normalized y is the one hitting at the highest v, so
    // the brightest place is the top center; analogously, the dimmest place is the bottom center
    const unitDirection = tracedRay.direction.normalize();
    const t = 0.5 * (unitDirection.y + 1);
    const color = new Vec(0, 0, 0, 0).interpolate(new Vec(1, 1, 1, 0), t);
    return color;
    //    another way to get increasingly rapid change of value away from the midline
    //    (square (x - k))*sgn(x - k) + k from 0 to 2k
    //    you can draw hyperbolic strips of approximately equal brightness
    //    using the below
    //    if (color.r > 0.3 && color.r < 0.31) {
    //        return new Vec(1, 0, 0);
    //    } else if (color.r > 0.7 && color.r < 0.71) {
    //        return new Vec(0, 1, 0);
    //    } else if (color.r > 0.49 && color.r < 0.51) {
    //        return new Vec(1, 1, 1);
    //    } else if (color.r > 0.8 && color.r < 0.81) {
    //        return new Vec(0, 0, 1);
    //    }
    //    return new Vec();
}
function clearCanvas(ctx, dimu, dimv) {
    ctx.clearRect(0, 0, dimu, dimv);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, dimu, dimv);
}
function drawPixel(ctx, x, y, color) {
    // ((x + y) / 256) * (256 - 255.99) > y
    // (x + y) * 0.01/256 > y
    // x > 255.99y
    //
    // 256 * 0.53517 => 137.00352
    // 255.99 * 0.53517 => 136.9981683
    // 120.001 / 256 => 0.46875390625
    // 0.46875390625 * 255.99 => 119.996312460938
    const fill = "rgb(" +
        Math.floor(color.r * 255.99) + "," +
        Math.floor(color.g * 255.99) + "," +
        Math.floor(color.b * 255.99) + ")";
    ctx.fillStyle = fill;
    //if (x % 10 === 0 && y % 10 === 0) {
    //    console.log(JSON.stringify({ x, y, fill }));
    //}
    ctx.fillRect(x, y, 1, 1);
}
}()}
  Pax.files["c:/btsync/sg/rayweekend/index.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs.deps = {"./draw":file_c$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs,"./setupSettingsGui":file_c$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs,"./sphere":file_c$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs,"./ray":file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs,"./vec":file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs}; file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs.filename = "c:/btsync/sg/rayweekend/index.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./ray')
  const __module1 = require._esModule('./vec')
  const __module2 = require._esModule('./draw')
  const __module3 = require._esModule('./sphere')
  const __module4 = require._esModule('./setupSettingsGui')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    Ray: {get() {return __module0.Ray}, enumerable: true},
    Vec: {get() {return __module1.Vec}, enumerable: true},
    draw: {get() {return __module2.draw}, enumerable: true},
    Sphere: {get() {return __module3.Sphere}, enumerable: true},
    setupSettingsGui: {get() {return __module4.setupSettingsGui}, enumerable: true},
  }))
}()) ~function() {
'use strict';

// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf
     ;
     ;
     ;
     ;
     ;
// user-editable settings
const userSettings = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: 0.2, min: 0, max: 4, step: 0.1 },
};
// scene
const sphereDistance = 10;
const fov = 10;
const getSphere = (userSettings, ox, oy) => new Sphere(new Vec(0 + ox, 0 + oy, -sphereDistance, 0), userSettings.radius);
const getScene = userSettings => ({
    dimu: 600,
    dimv: 600,
    camera: new Ray(new Vec(0, 0, 0, 0), new Vec(0, 0, -1, 0)),
    fov: fov,
    up: new Vec(0, 1, 0, 0),
    objects: [
        getSphere(userSettings, 0, 0),
        getSphere(userSettings, -0.2, -0.2),
        getSphere(userSettings, 0.2, 0),
        getSphere(userSettings, -0.4, -0.4),
        getSphere(userSettings, 0.4, 0),
        getSphere(userSettings, -0.6, -0.6),
        getSphere(userSettings, 0.6, 0),
    ]
});
// drawing canvas
const canvas = document.getElementById('canvas');
canvas.width = getScene(userSettings).dimu;
canvas.height = getScene(userSettings).dimv;
const ctx = canvas.getContext('2d');
// do the thing
const drawScene = () => draw(ctx, getScene(userSettings), userSettings);
setupSettingsGui(userSettings, drawScene);
drawScene();
}()}
  Pax.files["c:/btsync/sg/rayweekend/ray.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs.deps = {}; file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs.filename = "c:/btsync/sg/rayweekend/ray.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  Ray: {get() {return Ray}, enumerable: true},
});

 class Ray {
    constructor(origin, direction) {
        this._origin = origin;
        this._direction = direction;
    }
    get origin() {
        return this._origin;
    }
    get direction() {
        return this._direction;
    }
    toString() {
        return JSON.stringify({ o: this.origin + "", d: this.direction + "" }).replace(/"/g, "");
    }
}
}()}
  Pax.files["c:/btsync/sg/rayweekend/setupSettingsGui.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs.deps = {}; file_c$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs.filename = "c:/btsync/sg/rayweekend/setupSettingsGui.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  setupSettingsGui: {get() {return setupSettingsGui}, enumerable: true},
});

 function setupSettingsGui(userSettings, onChange) {
    const gui = new dat.GUI();
    for (const key of Object.keys(userSettings)) {
        const userSetting = userSettings[key];
        userSettings[key] = userSetting.initial;
        const step = userSetting.step || (userSetting.max - userSetting.min / 100);
        const newSetting = gui.add(userSettings, key, userSetting.min, userSetting.max)
            .step(step)
            .name(userSetting.name || key);
        newSetting.onFinishChange(x => onChange);
    }
}
}()}
  Pax.files["c:/btsync/sg/rayweekend/sphere.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs.deps = {}; file_c$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs.filename = "c:/btsync/sg/rayweekend/sphere.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  Sphere: {get() {return Sphere}, enumerable: true},
});

 class Sphere {
    constructor(center, radius) {
        this._center = center;
        this._radius = radius;
    }
    get center() {
        return this._center;
    }
    get radius() {
        return this._radius;
    }
    get type() {
        return "sphere";
    }
    hitByRay(ray) {
        const hitParam = this.hitByRayParam(ray);
        if (!(hitParam > 0)) {
            return null;
        }
        const hitPoint = ray
            .origin
            .add(ray.direction.scale(hitParam));
        const hitPointNormal = hitPoint
            .sub(this.center)
            .normalize();
        return {
            hitParam,
            hitPoint,
            hitPointNormal
        };
    }
    hitByRayParam(ray) {
        const radius = this.radius;
        const oc = ray.origin.sub(this.center);
        const a = ray.direction.dot(ray.direction);
        const b = 2 * oc.dot(ray.direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const disc = b * b - 4 * a * c;
        if (disc >= 0) {
            const x1 = (-b - Math.sqrt(disc)) / (2 * a);
            if (x1 > 0) {
                return x1;
            }
            const x2 = (-b + Math.sqrt(disc)) / (2 * a);
            if (x2 > 0) {
                return x2;
            }
        }
        return -1;
    }
}
}()}
  Pax.files["c:/btsync/sg/rayweekend/vec.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs.deps = {}; file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs.filename = "c:/btsync/sg/rayweekend/vec.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  Vec: {get() {return Vec}, enumerable: true},
});

 class Vec {
    constructor(x, y, z, w) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }
    get x() {
        return this._x;
    }
    setX(x) {
        return new Vec(x, this.y, this.z, this.w);
    }
    get y() {
        return this._y;
    }
    setY(y) {
        return new Vec(this.x, y, this.z, this.w);
    }
    get z() {
        return this._z;
    }
    setZ(z) {
        return new Vec(this.x, this.y, z, this.w);
    }
    get w() {
        return this._w;
    }
    setW(w) {
        return new Vec(this.x, this.y, this.z, w);
    }
    get r() {
        return this._x;
    }
    get g() {
        return this._y;
    }
    get b() {
        return this._z;
    }
    get a() {
        return this._w;
    }
    add(...args) {
        let toReturn = this;
        for (const v2 of args) {
            toReturn = new Vec(toReturn.x + v2.x, toReturn.y + v2.y, toReturn.z + v2.z, toReturn.w + v2.w);
        }
        return toReturn;
    }
    scale(s) {
        return new Vec(this.x * s, this.y * s, this.z * s, this.w * s);
    }
    sub(v2) {
        return this.add(v2.neg());
    }
    neg() {
        return this.scale(-1);
        //    howMany = typeof howMany === "undefined" ? 4 : howMany;
        //    return new Vec(
        //        howMany > 0 ? -this.x : this.x,
        //        howMany > 1 ? -this.y : this.y,
        //        howMany > 2 ? -this.z : this.z,
        //        howMany > 3 ? -this.w : this.w,
        //        );
    }
    normalize() {
        return this.scale(1 / this.length);
    }
    interpolate(v2, t) {
        return this.scale(t).add(v2.scale(1 - t));
    }
    dot(v2) {
        return this.x * v2.x + this.y * v2.y + this.z * v2.z + this.w * v2.w;
    }
    cross(v2) {
        /*
        yz - zy
        -xz + zx
        xy - yx
        */
        return new Vec(this.y * v2.z - this.z * v2.y, -this.x * v2.z + this.z * v2.x, this.x * v2.y - this.y * v2.x, this.w); // todo: 4d vector cross product
    }
    toString() {
        return JSON.stringify([
            this.x.toFixed(2),
            this.y.toFixed(2),
            this.z.toFixed(2),
            this.w.toFixed(2)
        ])
            .replace(/"/g, "");
    }
    get squaredLength() {
        return Math.pow(this.x, 2) +
            Math.pow(this.y, 2) +
            Math.pow(this.z, 2) +
            Math.pow(this.w, 2);
    }
    get length() {
        return Math.sqrt(this.squaredLength);
    }
}
}()}
  Pax.main = file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs; Pax.makeRequire(null)()
  if (typeof module !== 'undefined') module.exports = Pax.main.module && Pax.main.module.exports
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this)
//# sourceMappingURL=output.js.map
