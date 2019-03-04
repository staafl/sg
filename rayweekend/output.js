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

  Pax.files["c:/btsync/sg/rayweekend/drawing.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5cdrawing$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5cdrawing$2ejs.deps = {"./ray":file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs,"./vec":file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs}; file_c$3a$5cbtsync$5csg$5crayweekend$5cdrawing$2ejs.filename = "c:/btsync/sg/rayweekend/drawing.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5cdrawing$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./vec')
  const __module1 = require._esModule('./ray')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    vec: {get() {return __module0.vec}, enumerable: true},
    ray: {get() {return __module1.ray}, enumerable: true},
  }))
}()) ~function() {
'use strict';
Object.defineProperties(exports, {
  draw: {get() {return draw}, enumerable: true},
  clearCanvas: {get() {return clearCanvas}, enumerable: true},
  drawPixel: {get() {return drawPixel}, enumerable: true},
});

     ;
     ;

 function draw(scene, getColor) {

    const started = new Date().getTime();

    clearCanvas(scene.ctx, scene.dimu, scene.dimv);

    // our camera
    const origin = vec();

    // lower left corner of the viewport in camera coordinate system
    const lowerLeft = vec(-1, -1, -1);

    // such that lowerLeft + vvec + vvec = vec(-lowerLeft.x, -lowerLeft.y, lowerLeft.z);
    const uvec = vec(scene.userSettings.uvecX, 0, 0);
    const vvec = vec(0, scene.userSettings.vvecY, 0);

    for (let u = 0; u < scene.dimu; u += 1) {
        for (let v = 0; v < scene.dimv; v += 1) {
            const ur = u / scene.dimu; // [0;1)
            const vr = v / scene.dimv; // [0;1)

            // a ray from the camera to a pixel in the viewport
            const tracedRay = ray(origin, lowerLeft.add(uvec.scale(ur), vvec.scale(vr)));

            const color = getColor(tracedRay);

            drawPixel(scene.ctx, u, v, color);
        }
    }

    console.log(`drawing done: ${new Date().getTime() - started} ms`);
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
                    Math.floor(color[0] * 255.99) + "," +
                    Math.floor(color[1] * 255.99) + "," +
                    Math.floor(color[2] * 255.99) + ")";

    ctx.fillStyle = fill

    //if (x % 10 === 0 && y % 10 === 0) {
    //    console.log(JSON.stringify({ x, y, fill }));
    //}
    ctx.fillRect(x, y, 1, 1);
}
}()}
  Pax.files["c:/btsync/sg/rayweekend/index.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs.deps = {"./drawing":file_c$3a$5cbtsync$5csg$5crayweekend$5cdrawing$2ejs,"./misc":file_c$3a$5cbtsync$5csg$5crayweekend$5cmisc$2ejs,"./ray":file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs,"./vec":file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs}; file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs.filename = "c:/btsync/sg/rayweekend/index.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./vec')
  const __module1 = require._esModule('./ray')
  const __module2 = require._esModule('./drawing')
  const __module3 = require._esModule('./misc')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    vec: {get() {return __module0.vec}, enumerable: true},
    ray: {get() {return __module1.ray}, enumerable: true},
    draw: {get() {return __module2.draw}, enumerable: true},
    setupGui: {get() {return __module3.setupGui}, enumerable: true},
  }))
}()) ~function() {
'use strict';

// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf

     ;
     ;
     ;
     ;

const canvas = document.getElementById('canvas');

// u/v - uniform coordinate system of the viewport
// origin is top left, u goes left to right, v - top to bottom
// corresponds to browser's x/y, but we're using x/y/z for camera coordinate system

const ctx = canvas.getContext('2d');
const userSettings = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: 0.2, min: 0, max: 4, step: 0.1 },
};

const sphere = () => ({
    type: "sphere",
    center: vec(0, 0, -1),
    radius: userSettings.radius
});

const scene = {
    dimu: 600,
    dimv: 600,
    objects: [sphere],
    ctx,
    userSettings
}


canvas.width = scene.dimu;
canvas.height = scene.dimv;

const doDraw = () => draw(scene, getColor);

setupGui(scene.userSettings, doDraw);

function intersectsSphere(tracedRay, sphere) {
    const radius = sphere.radius;
    const oc = tracedRay.origin.sub(sphere.center);
    const a = tracedRay.direction.dot(tracedRay.direction);
    const b = 2 * oc.dot(tracedRay.direction);
    const c = oc.dot(oc) - sphere.radius * sphere.radius;
    const disc = b * b - 4 * a * c;
    return disc >= 0;
}

function getColor(tracedRay) {
    for (const obj of scene.objects) {
        const resolved = obj();
        if (resolved.type === "sphere") {
            if (intersectsSphere(tracedRay, resolved)) {
                return vec(1, 0, 0);
            }
        }
    }

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
    const t = 0.5*(unitDirection.y + 1);
    const color = vec(0, 0, 0).interpolate(vec(1, 1, 1), t);
    return color;
    // (square (abs(x - 0.5)))*sgn(x - 0.5) + 0.5 from 0 to 1
//    if (color.r > 0.3 && color.r < 0.31) {
//        return vec(1, 0, 0);
//    } else if (color.r > 0.7 && color.r < 0.71) {
//        return vec(0, 1, 0);
//    } else if (color.r > 0.49 && color.r < 0.51) {
//        return vec(1, 1, 1);
//    } else if (color.r > 0.8 && color.r < 0.81) {
//        return vec(0, 0, 1);
//    }
//    return vec();
}



doDraw();
}()}
  Pax.files["c:/btsync/sg/rayweekend/misc.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5cmisc$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5cmisc$2ejs.deps = {}; file_c$3a$5cbtsync$5csg$5crayweekend$5cmisc$2ejs.filename = "c:/btsync/sg/rayweekend/misc.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5cmisc$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  synonymize: {get() {return synonymize}, enumerable: true},
  setupGui: {get() {return setupGui}, enumerable: true},
});

// from [x, r, e1] defines properties x => _x, r => _x, e1 => _x
 function synonymize(obj, synonyms) {
    for (const synonymSet of synonyms) {
        const main = synonymSet[0];
        for (const other of synonymSet) {
            Object.defineProperty(
                obj,
                other,
                {
                    get: function() {
                        return this["_" + main];
                    }
                });
        }
    }
}

 function setupGui(userSettings, onChange) {
	var gui = new dat.GUI();

    var listen = ctrl => ctrl.onFinishChange(x => onChange);

    for (const key of Object.keys(userSettings)) {
        const userSetting = userSettings[key];
        userSettings[key] = userSetting.initial
        const step = userSetting.step || (userSettings.max - userSettings.min / 100);
        const newSetting = gui.add(
            userSettings,
            key,
            userSetting.min,
            userSetting.max)
            .step(step)
            .name(userSetting.name || key);

        listen(newSetting);
    }
}
}()}
  Pax.files["c:/btsync/sg/rayweekend/ray.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs.deps = {"./misc":file_c$3a$5cbtsync$5csg$5crayweekend$5cmisc$2ejs}; file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs.filename = "c:/btsync/sg/rayweekend/ray.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./misc')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    synonymize: {get() {return __module0.synonymize}, enumerable: true},
  }))
}()) ~function() {
'use strict';
Object.defineProperties(exports, {
  ray: {get() {return ray}, enumerable: true},
});

     ;

const rayProto = {};
synonymize(rayProto, [["direction"], ["origin"]]);
rayProto.toString = function() {
    return JSON.stringify({ o: this.origin + "", d: this.direction + "" }).replace(/"/g, "");
}

 function ray(origin, direction) {
    const toReturn = Object.create(rayProto);

    toReturn._origin = origin;
    toReturn._direction = direction;

    return toReturn;
}

}()}
  Pax.files["c:/btsync/sg/rayweekend/vec.js"] = file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs; file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs.deps = {"./misc":file_c$3a$5cbtsync$5csg$5crayweekend$5cmisc$2ejs}; file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs.filename = "c:/btsync/sg/rayweekend/vec.js"; function file_c$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./misc')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    synonymize: {get() {return __module0.synonymize}, enumerable: true},
  }))
}()) ~function() {
'use strict';
Object.defineProperties(exports, {
  vec: {get() {return vec}, enumerable: true},
});

     ;

const vecProto = {};

const vectorSynonyms = [
    ['x','r','0'],
    ['y','g','1'],
    ['z','b','2'],
    ['w','a','3'],
];

synonymize(vecProto, vectorSynonyms);

vecProto.add = function() {
    let toReturn = this;
    for (const v2 of arguments) {
        toReturn = vec(
            toReturn.x + v2.x,
            toReturn.y + v2.y,
            toReturn.z + v2.z,
            toReturn.w + v2.w);
    }
    return toReturn;
};

vecProto.scale = function(s) {
    return vec(this.x * s, this.y * s, this.z * s, this.w * s);
};

vecProto.normalize = function() {
    return this.scale(1 / this.length);
};

vecProto.sub = function(v2) {
    return this.add(v2.neg());
};

vecProto.interpolate = function(v2, t) {
    return this.scale(t).add(v2.scale(1 - t));
};

vecProto.neg = function() {
    return this.scale(-1);
//    howMany = typeof howMany === "undefined" ? 4 : howMany;
//    return vec(
//        howMany > 0 ? -this.x : this.x,
//        howMany > 1 ? -this.y : this.y,
//        howMany > 2 ? -this.z : this.z,
//        howMany > 3 ? -this.w : this.w,
//        );
};

vecProto.dot = function(v2) {
    return this.x * v2.x + this.y * v2.y + this.z * v2.z + this.w * v2.w;
};

vecProto.cross = function(v2) {
    /*
    yz - zy
    -xz + zx
    xy - yx
    */
    return vec(
        this.y * v2.z - this.z * v2.y,
        -this.x * v2.z + this.z * v2.x,
        this.x * v2.y - this.y * v2.x,
        this.w); // todo: 4d vector cross product
};
vecProto.toString = function() {
    return JSON.stringify([
            this.x.toFixed(2),
            this.y.toFixed(2),
            this.z.toFixed(2),
            this.w.toFixed(2)])
        .replace(/"/g, "");
};

Object.defineProperty(
    vecProto,
    'squaredLength',
    {
        get: function() {
            return Math.pow(this.x, 2) +
                Math.pow(this.y, 2) +
                Math.pow(this.z, 2) +
                Math.pow(this.w, 2);
            }
    });

Object.defineProperty(
    vecProto,
    'length',
    {
        get: function() {
            return Math.sqrt(this.squaredLength)
        }
    });

 function vec(x, y, z, w) {
    const toReturn = Object.create(vecProto);

    toReturn._x = x || 0;
    toReturn._y = y || 0;
    toReturn._z = z || 0;
    toReturn._w = w || 0;

    return toReturn;
}
}()}
  Pax.main = file_c$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs; Pax.makeRequire(null)()
  if (typeof module !== 'undefined') module.exports = Pax.main.module && Pax.main.module.exports
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this)
//# sourceMappingURL=output.js.map
