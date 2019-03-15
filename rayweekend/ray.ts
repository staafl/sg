import { Vec } from './vec';

export class Ray
{
    private _origin: Vec;
    private _direction: Vec;

    constructor(origin: Vec, direction: Vec)
    {
        this._origin = origin;
        this._direction = direction;
    }
    
    get origin()
    {
        return this._origin;
    }
    
    get direction()
    {
        return this._direction;
    }
    

    toString()
    {
        return JSON.stringify({ o: this.origin + "", d: this.direction + "" }).replace(/"/g, "");
    }
}

