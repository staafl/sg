import { HM } from './hm';
import { Ray } from './ray';
import { Vec } from './vec';

export interface Background
{
    getColor(scene: Scene, tracedRay: Ray, userSettings: UserSettings);
}

export interface HitInfo
{
    // distance along the ray measured as scaling factor of 'ray.direction'
    hitParam: number;
    hitPoint: Vec;
    hitPointNormal: Vec;
    hm: HM;
}

export interface Material
{
    getColor(hitInfo: HitInfo, scene: Scene);
}

export interface Scene
{
    dimu: number,
    dimv: number,
    objects: HM[],
    camera: Ray,
    viewportDistance: number,
    cameraUpDirection: Vec,
    background: Background
}

// u/v - uniform coordinate system of the viewport
// origin is top left, u goes left to right, v goes top to bottom
// corresponds to browser's x/y, but we're using x/y/z for the world coordinate system

export interface UserSettings
{
    uvecX: any,
    vvecY: any,
    radius: any,
    pixelStep: any,
    antialisingSamples: any
}
