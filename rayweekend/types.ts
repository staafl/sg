import { Ray } from './ray';

export interface Hitable
{
    type: "sphere";
    isHit: (Ray) => boolean;
}

export interface Scene
{
    dimu: number,
    dimv: number,
    objects: [Hitable]
}

// u/v - uniform coordinate system of the viewport
// origin is top left, u goes left to right, v - top to bottom
// corresponds to browser's x/y, but we're using x/y/z for camera coordinate system

export interface UserSettings
{
    uvecX: any,
    vvecY: any,
    radius: any
}
