const canvas = document.getElementById('canvas');
const dimx = 600;
const dimy = 300;
canvas.width = dimx;
canvas.height = dimy;
const ctx = canvas.getContext('2d');

// >>>

function draw() {

    clearCanvas();

    const origin = vec();
    const lowerLeft = vec(-2, -1, -1);
    const xvec = vec(4, 0, 0);
    const yvec = vec(0, 2, 0);

    for (let x = 0; x < dimx; x += 1) {
        for (let y = 0; y < dimy; y += 1) {
            const u = x / dimx;
            const v = y / dimy;
            //console.log(JSON.stringify({ x, y }));
            const tracedRay = ray(origin, lowerLeft.add(xvec.scale(u)).add(yvec.scale(v)));
            //console.log(tracedRay + "");
            const unitDirection = tracedRay.direction.normalize();
            //console.log(unitDirection + "");
            const t = 0.5*(unitDirection.y + 1);
            //console.log(t);
            //console.log();
            const color = vec(1, 1, 1).scale(t).add(vec(0.5, 0.7, 1).scale(1 - t));
            drawPixel(x, y, color);
        }
    }



}

function clearCanvas() {
    ctx.clearRect(0, 0, dimx, dimy);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, dimx, dimy);
}

function drawPixel(x, y, color) {
    const fill = "rgb(" +
                    (color[0] * 256) + "," +
                    (color[1] * 256) + "," +
                    (color[2] * 256) + ")";
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

vecProto.add = function(v2) {
    return vec(this.x + v2.x, this.y + v2.y, this.z + v2.z, this.w + v2.w);
};
vecProto.scale = function(s) {
    return vec(this.x * s, this.y * s, this.z * s, this.w * s);
};
vecProto.normalize = function() {
    return this.scale(1 / this.length);
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
