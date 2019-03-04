import { synonymize } from './misc';

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

export function vec(x, y, z, w) {
    const toReturn = Object.create(vecProto);

    toReturn._x = x || 0;
    toReturn._y = y || 0;
    toReturn._z = z || 0;
    toReturn._w = w || 0;

    return toReturn;
}
