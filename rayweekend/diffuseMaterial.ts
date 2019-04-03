import { HitInfo, Material, Scene, UserSettings } from './types';
import { Ray } from './ray';
import { rayCast } from './rayCast';
import { Vec } from './vec';

export class DiffuseMaterial implements Material
{
    private _color: Vec;
    private _absorption: number;

    constructor({ color, absorption }: { color: Vec, absorption: number })
    {
        this._color = color;
        this._absorption = absorption;
    }

    randomPointInUnitSphere()
    {
        while (true) {
            const pt = Vec.random();

            if (pt.length <= 1) {
                return pt;
            }

        }
    }

    getColor(hitInfo: HitInfo, scene: Scene, userSettings: UserSettings, params: any): Vec
    {
        if (params.depth > 2) {
            return this._color;
        }

        const bounce = new Ray(
            hitInfo.hitPoint,
            hitInfo.hitPoint.add(hitInfo.hitPointNormal, this.randomPointInUnitSphere()));

        const bounceInfo = rayCast(
            bounce,
            scene,
            userSettings,
            {
                ...params,
                depth: params.depth + 1
            });

        const bounceColor = bounceInfo.color.scale(1 - this._absorption);

        // idea: pass debug information through each bounce
        const toReturn = Vec.average([
            this._color,
            bounceColor]);

//        if (params.uu % 10 === 0)
//        {
//            console.log(params.uu);
//
//        }
        if (params.depth === 0 && params.uu > 140 && params.uu < 150 && params.vv > 140 && params.vv < 150)
        {
            // debugger;
        }

        return toReturn;
    }
}