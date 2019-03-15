import { Hitable, HitInfo } from './types';
import { Ray } from './ray';
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

    hitByRay(ray: Ray): HitInfo
    {
        const hitParam = this.hitByRayParam(ray);
        if (!(hitParam > 0))
        {
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

    hitByRayParam(ray: Ray): number
    {
        const radius = this.radius;
        const oc = ray.origin.sub(this.center);
        const a = ray.direction.dot(ray.direction);
        const b = 2 * oc.dot(ray.direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const disc = b * b - 4 * a * c;
        if (disc >= 0)
        {
            const x1 = (-b - Math.sqrt(disc))/(2*a);
            if (x1 > 0)
            {
                return x1;
            }

            const x2 = (-b + Math.sqrt(disc))/(2*a);
            if (x2 > 0)
            {
                return x2;
            }
        }

        return -1;
    }

}