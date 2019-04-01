import { HM } from './hm';
import { HitInfo } from './types';
import { Ray } from './ray';

export abstract class Hitable
{
    abstract get type(): "sphere";

    abstract hitByRay(Ray): HitInfo;
    
    __hm: HM;

    get hm(): HM
    {
        return this.__hm;
    }
}
