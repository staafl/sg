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

  Pax.files["C:/btsync/sg/rayweekend/calculateViewport.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5ccalculateViewport$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5ccalculateViewport$2ejs.deps = {}; file_C$3a$5cbtsync$5csg$5crayweekend$5ccalculateViewport$2ejs.filename = "C:/btsync/sg/rayweekend/calculateViewport.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5ccalculateViewport$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  calculateViewport: {get() {return calculateViewport}, enumerable: true},
});

 function calculateViewport(scene, userSettings) {
    const cameraPosition = scene.camera.origin;
    const cameraDir = scene.camera.direction.normalize();
    const cameraUpDir = scene.cameraUpDirection.normalize();
    const viewportRightDir = cameraDir.cross(cameraUpDir).normalize();
    const viewportCenter = cameraPosition.add(cameraDir.scale(scene.viewportDistance));
    // upper left corner of the viewport in world coordinate system
    const upperLeft = viewportCenter.add(viewportRightDir.neg(), cameraUpDir);
    // vectors used to trace out pixels on the viewport;
    // such that upperLeft + vvec + vvec = new Vec(-upperLeft.x, -upperLeft.y, upperLeft.z),
    // i.e. the right lower corner
    const uvec = viewportCenter.add(viewportRightDir.scale(userSettings.uvecX)).setZ(0);
    const vvec = viewportCenter.add(cameraUpDir.scale(userSettings.vvecY).neg()).setZ(0);
    console.log("Viewport calculations", { upperLeft, uvec, vvec, viewportRightDir, viewportCenter });
    return {
        upperLeft,
        cameraPosition,
        cameraDir,
        cameraUpDir,
        viewportRightDir,
        viewportCenter,
        uvec,
        vvec
    };
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/diffuseMaterial.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5cdiffuseMaterial$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5cdiffuseMaterial$2ejs.deps = {"./rayCast":file_C$3a$5cbtsync$5csg$5crayweekend$5crayCast$2ejs,"./ray":file_C$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs,"./vec":file_C$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs}; file_C$3a$5cbtsync$5csg$5crayweekend$5cdiffuseMaterial$2ejs.filename = "C:/btsync/sg/rayweekend/diffuseMaterial.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5cdiffuseMaterial$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./ray')
  const __module1 = require._esModule('./rayCast')
  const __module2 = require._esModule('./vec')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    Ray: {get() {return __module0.Ray}, enumerable: true},
    rayCast: {get() {return __module1.rayCast}, enumerable: true},
    Vec: {get() {return __module2.Vec}, enumerable: true},
  }))
}()) ~function() {
'use strict';
Object.defineProperties(exports, {
  DiffuseMaterial: {get() {return DiffuseMaterial}, enumerable: true},
});

     ;
     ;
     ;
 class DiffuseMaterial {
    constructor({ color, absorption }) {
        this._color = color;
        this._absorption = absorption;
    }
    randomPointInUnitSphere() {
        while (true) {
            const pt = Vec.random();
            if (pt.length <= 1) {
                return pt;
            }
        }
    }
    getColor(hitInfo, scene, userSettings, params) {
        if (params.depth > userSettings.maxDiffuseBounces) {
            return this._color;
        }
        const bounce = new Ray(hitInfo.hitPoint, hitInfo.hitPoint.add(hitInfo.hitPointNormal, this.randomPointInUnitSphere()));
        const bounceInfo = rayCast(bounce, scene, userSettings, Object.assign({}, params, { depth: params.depth + 1 }));
        const bounceColor = bounceInfo.color.scale(1 - this._absorption);
        // idea: pass debug information through each bounce
        const toReturn = Vec.average([
            this._color,
            bounceColor
        ]);
        //        if (params.uu % 10 === 0)
        //        {
        //            console.log(params.uu);
        //
        //        }
        if (params.depth === 0 && params.uu > 140 && params.uu < 150 && params.vv > 140 && params.vv < 150) {
            // debugger;
        }
        return toReturn;
    }
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/draw.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs.deps = {"./global":file_C$3a$5cbtsync$5csg$5crayweekend$5cglobal$2ejs,"./calculateViewport":file_C$3a$5cbtsync$5csg$5crayweekend$5ccalculateViewport$2ejs,"./rayCast":file_C$3a$5cbtsync$5csg$5crayweekend$5crayCast$2ejs,"./ray":file_C$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs,"./vec":file_C$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs}; file_C$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs.filename = "C:/btsync/sg/rayweekend/draw.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./calculateViewport')
  const __module1 = require._esModule('./global')
  const __module2 = require._esModule('./ray')
  const __module3 = require._esModule('./rayCast')
  const __module4 = require._esModule('./vec')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    calculateViewport: {get() {return __module0.calculateViewport}, enumerable: true},
    Global: {get() {return __module1.Global}, enumerable: true},
    Ray: {get() {return __module2.Ray}, enumerable: true},
    rayCast: {get() {return __module3.rayCast}, enumerable: true},
    Vec: {get() {return __module4.Vec}, enumerable: true},
  }))
}()) ~function() {
'use strict';
Object.defineProperties(exports, {
  draw: {get() {return draw}, enumerable: true},
});

     ;
     ;
     ;
     ;
     ;
 function draw(ctx, scene, userSettings) {
    const started = new Date().getTime();
    clearCanvas(ctx, scene.dimu, scene.dimv);
    // prepare to cast rays; each ray will produce the color of 1 pixel
    // (or an QxQ square of pixels where Q = step)
    // first, figure out the viewport
    const { cameraPosition, upperLeft, uvec, vvec } = calculateViewport(scene, userSettings);
    // how, produce the rays and use them to get the pixel colors
    const step = userSettings.pixelStep;
    const samples = userSettings.antialisingSamples;
    const samplesRoot = Math.sqrt(samples);
    for (let uu = 0; uu < scene.dimu; uu += step) {
        setTimeout(function () {
            for (let vv = 0; vv < scene.dimv; vv += step) {
                const colors = [];
                for (let us = 0; us < samplesRoot; ++us) {
                    for (let vs = 0; vs < samplesRoot; ++vs) {
                        // for each (uu, vv) pixel in the viewport
                        const ur = (uu + (step / 2) + us / samplesRoot) / scene.dimu; // [0;1)
                        const vr = (vv + (step / 2) + vs / samplesRoot) / scene.dimv; // [0;1)
                        // create a ray from the camera to the pixel
                        const ray = new Ray(cameraPosition, upperLeft.add(uvec.scale(ur), vvec.scale(vr)));
                        const color = rayCast(ray, scene, userSettings, { uu, vv, depth: 0 }).color;
                        colors.push(color);
                    }
                }
                const averageColor = Vec.average(colors);
                drawPixel(ctx, uu, vv, averageColor, step);
            }
        }, 1);
    }
    Global.lastDrawn = { scene, userSettings };
    console.log(`drawing done: ${new Date().getTime() - started} ms`);
}
function clearCanvas(ctx, dimu, dimv) {
    ctx.clearRect(0, 0, dimu, dimv);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, dimu, dimv);
}
function drawPixel(ctx, x, y, color, step) {
    const colorFactor = 255.99;
    // can the choice of multiplication factor influence
    // the final rounded color value?
    // let x be the whole part of the multiplied number, y - the fractional part
    // ((x + y) / 256) * (256 - 255.99) > y
    // (x + y) * 0.01/256 > y
    // x > 255.99y
    // answer: yes
    //
    // examples:
    // (1)
    // 256 * 0.53517 => 137.00352
    // 255.99 * 0.53517 => 136.9981683
    //
    // (2)
    // 120.001 / 256 => 0.46875390625
    // 0.46875390625 * 255.99 => 119.996312460938
    const fill = "rgb(" +
        Math.floor(color.r * colorFactor) + "," +
        Math.floor(color.g * colorFactor) + "," +
        Math.floor(color.b * colorFactor) + ")";
    ctx.fillStyle = fill;
    //if (x % 10 === 0 && y % 10 === 0) {
    //    console.log(JSON.stringify({ x, y, fill }));
    //}
    ctx.fillRect(x, y, step, step);
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/global.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5cglobal$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5cglobal$2ejs.deps = {}; file_C$3a$5cbtsync$5csg$5crayweekend$5cglobal$2ejs.filename = "C:/btsync/sg/rayweekend/global.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5cglobal$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  Global: {get() {return Global}, enumerable: true},
});

 class Global {
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/hitable.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5chitable$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5chitable$2ejs.deps = {}; file_C$3a$5cbtsync$5csg$5crayweekend$5chitable$2ejs.filename = "C:/btsync/sg/rayweekend/hitable.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5chitable$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  Hitable: {get() {return Hitable}, enumerable: true},
});

 class Hitable {
    constructor(id) {
        this._id = id;
    }
    get hm() {
        return this.__hm;
    }
    get id() {
        return this._id;
    }
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/hm.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5chm$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5chm$2ejs.deps = {}; file_C$3a$5cbtsync$5csg$5crayweekend$5chm$2ejs.filename = "C:/btsync/sg/rayweekend/hm.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5chm$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  HM: {get() {return HM}, enumerable: true},
});

 class HM {
    constructor(hitable, material) {
        this._hitable = hitable;
        this._material = material;
        hitable.__hm = this;
    }
    get hitable() {
        return this._hitable;
    }
    get material() {
        return this._material;
    }
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/hyperbolicBackground.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5chyperbolicBackground$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5chyperbolicBackground$2ejs.deps = {"./vec":file_C$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs}; file_C$3a$5cbtsync$5csg$5crayweekend$5chyperbolicBackground$2ejs.filename = "C:/btsync/sg/rayweekend/hyperbolicBackground.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5chyperbolicBackground$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./vec')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    Vec: {get() {return __module0.Vec}, enumerable: true},
  }))
}()) ~function() {
'use strict';
Object.defineProperties(exports, {
  HyperbolicBackground: {get() {return HyperbolicBackground}, enumerable: true},
});

     ;
 class HyperbolicBackground {
    getColor(ray, scene, userSettings) {
        // among all rays that hit the viewport at a given vv', the one with the highest
        // normalized abs(y) is the one with x = 0 (the one going directly towards the viewport)
        // all vectors from the origin have the same non-normalized y (=vv'), divided by a length
        // >= sqrt(vv'^2 + z^2), with equality only when x = 0
        //
        // imagine a cone with a vertex at the origin (i.e. rays with a given 'y') intersecting a
        // plane (the viewport plane) - you get a hyperbola
        //
        // vv' = y/sqrt(x^2 + y^2 + z'^2) (z' and vv' are parameters)
        // vv'^2*z'^2 = y^2*(1-vv'^2) - x^2 (which is a hyperbolic formula)
        // y = +/- sqrt(param + x^2)/param => y has maximum abs when x = 0
        //
        // this is why the resulting gradient is dimmest in the middle and gets brighter at the sides
        // (bottom half), or is brightest in the middle and dims towards the sides (top half)
        // - points with equal lumosity are on a hyperbola with vertex in the vertical midline
        // of the viewport
        //
        // among rays with x=0, the highest normalized y is the one hitting at the highest vv, so
        // the brightest place is the top center; analogously, the dimmest place is the bottom center
        const unitDir = ray.direction.normalize();
        const t = 0.5 * (unitDir.y + 1);
        const color = new Vec(0, 0, 0, 0).interpolate(new Vec(1, 1, 1, 0), t);
        return color;
        /*
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
*/
    }
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/index.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs.deps = {"./draw":file_C$3a$5cbtsync$5csg$5crayweekend$5cdraw$2ejs,"./hyperbolicBackground":file_C$3a$5cbtsync$5csg$5crayweekend$5chyperbolicBackground$2ejs,"./setupSettingsGui":file_C$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs,"./diffuseMaterial":file_C$3a$5cbtsync$5csg$5crayweekend$5cdiffuseMaterial$2ejs,"./global":file_C$3a$5cbtsync$5csg$5crayweekend$5cglobal$2ejs,"./calculateViewport":file_C$3a$5cbtsync$5csg$5crayweekend$5ccalculateViewport$2ejs,"./rayCast":file_C$3a$5cbtsync$5csg$5crayweekend$5crayCast$2ejs,"./sphere":file_C$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs,"./hm":file_C$3a$5cbtsync$5csg$5crayweekend$5chm$2ejs,"./ray":file_C$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs,"./vec":file_C$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs}; file_C$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs.filename = "C:/btsync/sg/rayweekend/index.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./calculateViewport')
  const __module1 = require._esModule('./draw')
  const __module2 = require._esModule('./diffuseMaterial')
  const __module3 = require._esModule('./global')
  const __module4 = require._esModule('./hm')
  const __module5 = require._esModule('./hyperbolicBackground')
  const __module6 = require._esModule('./ray')
  const __module7 = require._esModule('./rayCast')
  const __module8 = require._esModule('./setupSettingsGui')
  const __module9 = require._esModule('./sphere')
  const __module10 = require._esModule('./vec')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    calculateViewport: {get() {return __module0.calculateViewport}, enumerable: true},
    draw: {get() {return __module1.draw}, enumerable: true},
    DiffuseMaterial: {get() {return __module2.DiffuseMaterial}, enumerable: true},
    Global: {get() {return __module3.Global}, enumerable: true},
    HM: {get() {return __module4.HM}, enumerable: true},
    HyperbolicBackground: {get() {return __module5.HyperbolicBackground}, enumerable: true},
    Ray: {get() {return __module6.Ray}, enumerable: true},
    rayCast: {get() {return __module7.rayCast}, enumerable: true},
    setupSettingsGui: {get() {return __module8.setupSettingsGui}, enumerable: true},
    Sphere: {get() {return __module9.Sphere}, enumerable: true},
    Vec: {get() {return __module10.Vec}, enumerable: true},
  }))
}()) ~function() {
'use strict';

// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf
// interesting places:
// - draw.ts, draw(Context, Scene, UserSettings)
// - rayCast.ts, rayCast(Scene, Ray)
// - Hitable subclasses, hitByRay(Ray)
// - Material subclasses, getColor(HitInfo
     ;
     ;
     ;
     ;
     ;
     ;
     ;
     ;
     ;
     ;
     ;
const pick = (ar, id) => {
    if (id) {
        if (!isNaN(id)) {
            return ar[Number(id) % ar.length];
        }
        else if (typeof id === "string") {
            let ix = 0;
            for (const ch of id) {
                ix += ch.charCodeAt(0);
            }
            return ar[ix % ar.length];
        }
    }
    if (ar._ix === undefined) {
        ar._ix = 0;
    }
    else {
        ar._ix += 1;
        ar._ix %= ar.length;
    }
    const toReturn = ar[ar._ix];
    // return ar[Math.floor(Math.random() * ar.length)];
    console.log(toReturn);
    return toReturn;
};
const ndump = (...args) => {
    return args[0];
};
const dump = (...args) => {
    console.log(...args);
    return args[0];
};
const firstDefined = (...args) => {
    for (const arg of args) {
        if (arg !== undefined) {
            return arg;
        }
    }
    return undefined;
};
// user-editable settings
const scale = 2;
const pixelStep = scale *
    //10;
    2;
const samples = 
//1;
4;
const initialRadius = 0.5;
//const initialRadius = 10;
const userSettingsTemplate = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: initialRadius, min: 0, max: 40, step: 0.1 },
    pixelStep: { name: "pixel step", initial: pixelStep, min: 1, max: 40, step: 1 },
    antialisingSamples: { name: "antialising samples", initial: samples, min: 1, max: 100, step: 1 },
    diffuseAbsorption: { name: "diffuse absorption", initial: 0.5, min: 0, max: 1, step: 0.1 },
    maxDiffuseBounces: { name: "max diffuse bounces", initial: 2, min: 1, max: 10, step: 1 }
};
// getSceneFromUserSettings() :: UserSettings => Scene
const sphereDistance = 10;
const viewportDistance = 10;
const cameraOrigin = new Vec(0, 0, 0, 0);
const cameraDirection = new Vec(0, 0, -1, 0);
const cameraUpDirection = new Vec(0, 1, 0, 0);
// const cameraUpDirection = new Vec(0.5, 1, 0, 0);
const dimu = scale * 300;
const dimv = scale * 300;
// const sphereDefs = [[0, 0], [-0.2, -0.2], [0.2, 0]];//, [-0.4, -0.4], [0.4, 0], [-0.6, -0.6], [0.6, 0]];
const bigRadius = 20;
const bigY = -bigRadius - initialRadius + 0.5;
const bigZ = dump(Math.sqrt((bigRadius + initialRadius) * (bigRadius + initialRadius) - bigY * bigY), "bigZ");
dump({ bigZ, bigY, bigRadius, initialRadius }, "spheres");
dump(bigY * bigY + bigZ * bigZ, "stuff");
dump(Math.sqrt(bigY * bigY + bigZ * bigZ) - bigRadius - initialRadius, "error");
const sphereDefs = [[0, 0], { x: 0, y: bigY, z: bigZ, r: bigRadius }];
// const sphereDistance = 300;
// const sphereDefs: any[] = [[0, 0], { x: 0, y: -500, z: -sphereDistance - 90, r: 500 }];
const colors = [new Vec(1, 0, 0, 0), new Vec(1, 1, 0, 0)];
const getSphereFromUserSettings = (userSettings, { centerX, centerY, centerZ, radius, id, color }) => new HM(new Sphere({
    center: ndump(new Vec(centerX, centerY, centerZ || -sphereDistance, 0), "c"),
    radius: ndump(radius || userSettings.radius, "r"),
    id: ndump(id || Math.random() + "", "id")
}), 
//new NormalMaterial()
new DiffuseMaterial({
    color: color || pick(colors, id) || Vec.random(),
    absorption: userSettings.diffuseAbsorption
}));
const getSceneObjectsFromUserSettings = (userSettings) => sphereDefs.map((sphereDef, ix) => getSphereFromUserSettings(userSettings, Object.assign({}, sphereDef, { centerX: firstDefined(sphereDef.x, sphereDef[0]), centerY: firstDefined(sphereDef.y, sphereDef[1]), centerZ: firstDefined(sphereDef.z, sphereDef[2]), radius: firstDefined(sphereDef.r, sphereDef[3]), id: firstDefined(sphereDef.id, sphereDef[4], ix + "") })));
const getSceneFromUserSettings = (userSettings) => ({
    dimu: dimu,
    dimv: dimv,
    camera: new Ray(cameraOrigin, cameraDirection),
    viewportDistance: viewportDistance,
    cameraUpDirection: cameraUpDirection,
    objects: getSceneObjectsFromUserSettings(userSettings),
    background: new HyperbolicBackground()
});
// setup drawing canvas and get its context 'ctx'
const canvas = document.getElementById('canvas');
canvas.width = dimu;
canvas.height = dimv;
const ctx = canvas.getContext('2d');
// do the thing
let userSettings;
const drawScene = () => draw(ctx, getSceneFromUserSettings(userSettings), userSettings);
userSettings = setupSettingsGui(userSettingsTemplate, drawScene);
drawScene();
const hitinfoElem = document.getElementById('hitinfo');
canvas.addEventListener('mousemove', function (evt) {
    // hitinfoElem.innerText = evt.offsetX + " " + evt.offsetY;
    const { scene, userSettings } = Global.lastDrawn;
    if (!scene) {
        return;
    }
    const { upperLeft, uvec, vvec } = calculateViewport(scene, userSettings);
    const ray = new Ray(scene.camera.origin, upperLeft.add(uvec.scale(evt.offsetX / scene.dimu), vvec.scale(evt.offsetY / scene.dimv)));
    const ch = rayCast(ray, scene, userSettings, { depth: 0 });
    const scaledColor = ch.color.scale(255.99);
    hitinfoElem.innerText = JSON.stringify({
        x: evt.offsetX,
        y: evt.offsetY,
        color: {
            r: Math.floor(scaledColor.x),
            g: Math.floor(scaledColor.y),
            b: Math.floor(scaledColor.z),
        },
        id: ch.hit && ch.hit.hm && ch.hit.hm.hitable.id
    });
});
}()}
  Pax.files["C:/btsync/sg/rayweekend/ray.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs.deps = {}; file_C$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs.filename = "C:/btsync/sg/rayweekend/ray.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5cray$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
  Pax.files["C:/btsync/sg/rayweekend/rayCast.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5crayCast$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5crayCast$2ejs.deps = {"./vec":file_C$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs}; file_C$3a$5cbtsync$5csg$5crayweekend$5crayCast$2ejs.filename = "C:/btsync/sg/rayweekend/rayCast.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5crayCast$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./vec')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    Vec: {get() {return __module0.Vec}, enumerable: true},
  }))
}()) ~function() {
'use strict';
Object.defineProperties(exports, {
  rayCast: {get() {return rayCast}, enumerable: true},
});

     ;
 function rayCast(ray, scene, userSettings, params) {
    const cameraPosition = scene.camera.origin;
    let closestHit = null;
    let closestHitDistance = undefined;
    for (const hm of scene.objects) {
        const thisHit = hm.hitable.hitByRay(ray);
        if (!thisHit) {
            continue;
        }
        const thisHitDistance = thisHit.hitPoint.sub(cameraPosition).length;
        if (closestHitDistance === undefined ||
            closestHitDistance > thisHitDistance) {
            closestHit = thisHit;
            closestHitDistance = thisHitDistance;
        }
    }
    if (closestHit) {
        //if (closestHit.hm.hitable.id !== "1") {
        //    console.log(closestHit.hm.hitable.id, debug, ray);
        //}
        return {
            color: closestHit.hm.material.getColor(closestHit, scene, userSettings, params),
            hit: closestHit
        };
    }
    if (scene.background) {
        return {
            color: scene.background.getColor(ray, scene, userSettings, params)
        };
    }
    return {
        color: new Vec(0, 0, 0, 0)
    };
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/setupSettingsGui.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs.deps = {}; file_C$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs.filename = "C:/btsync/sg/rayweekend/setupSettingsGui.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5csetupSettingsGui$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
~function() {
'use strict';
Object.defineProperties(exports, {
  setupSettingsGui: {get() {return setupSettingsGui}, enumerable: true},
});

 function setupSettingsGui(userSettingsTemplate, onChange) {
    const gui = new dat.GUI();
    window.__nogc = window.__nogc || {};
    window.__nogc.gui = gui;
    const userSettingsObj = {};
    const userSettingsCache = {};
    for (const key in userSettingsTemplate) {
        const userSetting = userSettingsTemplate[key];
        userSettingsObj[key] = userSetting.initial;
        userSettingsCache[key] = userSetting.initial;
        const step = userSetting.step || (userSetting.max - userSetting.min / 100);
        const thisSettingObject = gui.add(userSettingsObj, key, userSetting.min, userSetting.max)
            .step(step)
            .name(userSetting.name || key);
        thisSettingObject.onFinishChange((value) => {
            const oldValue = userSettingsCache[key];
            if (value !== oldValue) {
                userSettingsCache[key] = value;
                onChange({ key, value, oldValue });
            }
        });
    }
    window.addEventListener('load', function () {
        setTimeout(function () {
            for (const dg of document.querySelectorAll("div.dg.main.a")) {
                dg.style.width = "500px";
            }
        }, 1000);
    });
    return userSettingsObj;
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/sphere.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs.deps = {"./hitable":file_C$3a$5cbtsync$5csg$5crayweekend$5chitable$2ejs}; file_C$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs.filename = "C:/btsync/sg/rayweekend/sphere.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5csphere$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
Object.defineProperty(exports, '__esModule', {value: true})
with (function() {
  const __module0 = require._esModule('./hitable')
  return Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {value: 'ModuleImports'},
    Hitable: {get() {return __module0.Hitable}, enumerable: true},
  }))
}()) ~function() {
'use strict';
Object.defineProperties(exports, {
  Sphere: {get() {return Sphere}, enumerable: true},
});

     ;
 class Sphere extends Hitable {
    constructor({ center, radius, id }) {
        super(id);
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
            hitPointNormal,
            hm: this.hm,
            ray
        };
    }
    hitByRayParam(ray) {
        const radius = this.radius;
        const oc = ray.origin.sub(this.center);
        const a = ray.direction.dot(ray.direction);
        const b = 2 * oc.dot(ray.direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const disc = (b * b) - (4 * a * c);
        if (disc >= 0) {
            const bover2a = -b / (2 * a);
            const diff = Math.sqrt(disc) / (2 * a);
            const x1 = bover2a - diff;
            if (x1 > 0) {
                return x1;
            }
            const x2 = bover2a + diff;
            if (x2 > 0) {
                return x2;
            }
        }
        return -1;
    }
}
}()}
  Pax.files["C:/btsync/sg/rayweekend/vec.js"] = file_C$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs; file_C$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs.deps = {}; file_C$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs.filename = "C:/btsync/sg/rayweekend/vec.js"; function file_C$3a$5cbtsync$5csg$5crayweekend$5cvec$2ejs(module, exports, require, __filename, __dirname, __import_meta) {
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
    static random() {
        return new Vec(Math.random(), Math.random(), Math.random(), 0);
    }
    static average(vectors) {
        return vectors
            .reduce((s, c) => s.add(c), new Vec(0, 0, 0, 0))
            .scale(1 / vectors.length);
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
  Pax.main = file_C$3a$5cbtsync$5csg$5crayweekend$5cindex$2ejs; Pax.makeRequire(null)()
  if (typeof module !== 'undefined') module.exports = Pax.main.module && Pax.main.module.exports
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this)
//# sourceMappingURL=output.js.map
