import { Hitable } from './types';
import { Vec } from './vec';

export class Sphere implements Hitable
{
    private _center: Vec;
    private _radius: number;
    
    constructor(center: Vec, radius: number)
    {
        this._center = center;
        this._radius = radius;
    }
    
    get center(): Vec
    {
        return this._center;
    }
    
    get radius(): number
    {
        return this._radius;
    }
    
    get type(): "sphere"
    {
        return "sphere";
    }

    isHit(tracedRay)
    {
        const radius = this.radius;
        const oc = tracedRay.origin.sub(this.center);
        const a = tracedRay.direction.dot(tracedRay.direction);
        const b = 2 * oc.dot(tracedRay.direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const disc = b * b - 4 * a * c;
        return disc >= 0;
    }

}