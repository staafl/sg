import { HitInfo, Material, Scene } from './types';
import { Vec } from './vec';

export class DiffuseMaterial implements Material
{
    getColor(hitInfo: HitInfo, scene: Scene): Vec
    {
        return new Vec(0, 0, 0, 0);
    }
}