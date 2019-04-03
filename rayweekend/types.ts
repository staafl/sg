import { HM } from './hm';
import { Ray } from './ray';
import { Vec } from './vec';

export interface ColorAndHit
{
    color: Vec;
    
    hit?: HitInfo;
}

export interface Background
{
    getColor(ray: Ray, scene: Scene, userSettings: UserSettings, params: any);
}

export interface HitInfo
{
    // distance along the ray measured as scaling factor of 'ray.direction'
    hitParam: number;
    hitPoint: Vec;
    hitPointNormal: Vec;
    hm: HM;
    ray: Ray;
}

export interface Material
{
    getColor(hitInfo: HitInfo, scene: Scene, userSettings: UserSettings, params: any);
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
    antialisingSamples: any,
    diffuseAbsorption: any,
    maxDiffuseBounces: any
}
