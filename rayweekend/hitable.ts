import { HM } from './hm';
import { HitInfo } from './types';
import { Ray } from './ray';

export abstract class Hitable
{
    abstract get type(): "sphere";

    abstract hitByRay(Ray): HitInfo;
    
    __hm: HM;
    
    private _id: string;
    
    constructor(id: string)
    {
        this._id = id;
    }

    get hm(): HM
    {
        return this.__hm;
    }
    
    get id(): string
    {
        return this._id;
    }
}
