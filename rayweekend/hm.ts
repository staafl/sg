import { Hitable } from './hitable';
import { Material } from './types';

export class HM
{
    private _material: Material;
    private _hitable: Hitable;

    public constructor(hitable: Hitable, material: Material)
    {
        this._hitable = hitable;
        this._material = material;
        hitable.__hm = this;
    }

    get hitable(): Hitable
    {
        return this._hitable;
    }

    get material(): Material
    {
        return this._material;
    }
}