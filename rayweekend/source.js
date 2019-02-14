const canvas = document.getElementById('canvas');
// u/v - uniform coordinate system of the viewport
// origin is top left, u goes left to right, v - top to bottom
// corresponds to browser's x/y, but we're using x/y/z for camera coordinate system
const dimu = 600;
const dimv = 600;
canvas.width = dimu;
canvas.height = dimv;
const ctx = canvas.getContext('2d');

// >>>

const userSettings = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: 0, min: 0, max: 4, step: 0.1 },
};

function setupGui() {
	var gui = new dat.GUI();

    var listen = ctrl => ctrl.onFinishChange(x => draw());

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

setupGui();

function draw() {

    const started = new Date().getTime();

    clearCanvas();

    // our camera
    const origin = vec();

    // lower left corner of the viewport in camera coordinate system
    const lowerLeft = vec(-1, -1, -1);

    // such that lowerLeft + vvec + vvec = vec(-lowerLeft.x, -lowerLeft.y, lowerLeft.z);
    const uvec = vec(userSettings.uvecX, 0, 0);
    const vvec = vec(0, userSettings.vvecY, 0);

    for (let u = 0; u < dimu; u += 1) {
        for (let v = 0; v < dimv; v += 1) {
            const ur = u / dimu; // [0;1)
            const vr = v / dimv; // [0;1)

            // a ray from the camera to a pixel in the viewport
            const tracedRay = ray(origin, lowerLeft.add(uvec.scale(ur), vvec.scale(vr)));

            const color = getColor(tracedRay);

            drawPixel(u, v, color);
        }
    }

    console.log(`drawing done: ${new Date().getTime() - started} ms`);
}

function getColor(tracedRay) {
    const sphereCenter = vec(0, 0, -1);
    const radius = userSettings.radius;
    const oc = tracedRay.origin.sub(sphereCenter);
    const a = tracedRay.direction.dot(tracedRay.direction);
    const b = 2 * oc.dot(tracedRay.direction);
    const c = oc.dot(oc) - radius * radius;
    const disc = b * b - 4 * a * c;

    if (disc > 0) {
        return vec(1, 0, 0);
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

function clearCanvas() {
    ctx.clearRect(0, 0, dimu, dimv);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, dimu, dimv);
}

function drawPixel(x, y, color) {
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

// >>> vectors

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
    return JSON.stringify([this.x.toFixed(2), this.y.toFixed(2), this.z.toFixed(2), this.w.toFixed(2)]).replace(/"/g, "");
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

// >>> rays

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

// >>>

draw();

// >>> misc

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
