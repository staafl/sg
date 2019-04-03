export class Vec
{
    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;

    constructor(x: number, y: number, z: number, w: number)
    {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }
    
    static random(): Vec
    {
        return new Vec(Math.random(), Math.random(), Math.random(), 0);
    }
    
    static average(vectors: Vec[]): Vec {
        return vectors
            .reduce((s, c) => s.add(c), new Vec(0,0,0,0))
            .scale(1 / vectors.length);
    }

    get x(): number
    {
        return this._x;
    }

    setX(x: number): Vec
    {
        return new Vec(x, this.y, this.z, this.w);
    }

    get y(): number
    {
        return this._y;
    }

    setY(y: number): Vec
    {
        return new Vec(this.x, y, this.z, this.w);
    }

    get z(): number
    {
        return this._z;
    }

    setZ(z: number): Vec
    {
        return new Vec(this.x, this.y, z, this.w);
    }

    get w(): number
    {
        return this._w;
    }

    setW(w: number): Vec
    {
        return new Vec(this.x, this.y, this.z, w);
    }

    get r(): number
    {
        return this._x;
    }

    get g(): number
    {
        return this._y;
    }

    get b(): number
    {
        return this._z;
    }

    get a(): number
    {
        return this._w;
    }

    add(...args: Vec[]): Vec
    {
        let toReturn: Vec = this;
        for (const v2 of args) {
            toReturn = new Vec(
                toReturn.x + v2.x,
                toReturn.y + v2.y,
                toReturn.z + v2.z,
                toReturn.w + v2.w);
        }
        return toReturn;
    }

    scale(s)
    {
        return new Vec(this.x * s, this.y * s, this.z * s, this.w * s);
    }

    sub(v2)
    {
        return this.add(v2.neg());
    }

    neg()
    {
        return this.scale(-1);
    //    howMany = typeof howMany === "undefined" ? 4 : howMany;
    //    return new Vec(
    //        howMany > 0 ? -this.x : this.x,
    //        howMany > 1 ? -this.y : this.y,
    //        howMany > 2 ? -this.z : this.z,
    //        howMany > 3 ? -this.w : this.w,
    //        );
    }

    normalize()
    {
        return this.scale(1 / this.length);
    }

    interpolate(v2, t)
    {
        return this.scale(t).add(v2.scale(1 - t));
    }

    dot(v2)
    {
        return this.x * v2.x + this.y * v2.y + this.z * v2.z + this.w * v2.w;
    }

    cross(v2)
    {
        /*
        yz - zy
        -xz + zx
        xy - yx
        */
        return new Vec(
            this.y * v2.z - this.z * v2.y,
            -this.x * v2.z + this.z * v2.x,
            this.x * v2.y - this.y * v2.x,
            this.w); // todo: 4d vector cross product
    }

    toString()
    {
        return JSON.stringify([
                this.x.toFixed(2),
                this.y.toFixed(2),
                this.z.toFixed(2),
                this.w.toFixed(2)])
            .replace(/"/g, "");
    }

    get squaredLength()
    {
        return Math.pow(this.x, 2) +
            Math.pow(this.y, 2) +
            Math.pow(this.z, 2) +
            Math.pow(this.w, 2);
    }

    get length()
    {
        return Math.sqrt(this.squaredLength)
    }
}


