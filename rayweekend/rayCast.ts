import { ColorAndHit, HitInfo, Scene, UserSettings } from './types';
import { Ray } from './ray';
import { Vec } from './vec';

export function rayCast(ray: Ray, scene: Scene, userSettings: UserSettings, params: any): ColorAndHit {

    const cameraPosition = scene.camera.origin;

    let closestHit: HitInfo = null;

    let closestHitDistance: number = undefined;

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
            color: closestHit.hm.material.getColor(
                closestHit,
                scene,
                userSettings,
                params),
            hit: closestHit
        };

    }

    if (scene.background) {
        return {
            color: scene.background.getColor(
                ray,
                scene,
                userSettings,
                params)
        };
    }

    return {
        color: new Vec(0, 0, 0, 0)
    };
}