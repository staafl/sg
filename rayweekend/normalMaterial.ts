import { HitInfo, Material, Scene } from './types';
import { Vec } from './vec';

export class NormalMaterial implements Material
{
    getColor(hitInfo: HitInfo, scene: Scene): Vec
    {
        return new Vec(
                hitInfo.hitPointNormal.x + 1,
                hitInfo.hitPointNormal.y + 1,
                hitInfo.hitPointNormal.z + 1,
                0)
            .scale(0.5);
    }
}