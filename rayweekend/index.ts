// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf

// interesting places:
// - draw.ts, draw(Context, Scene, UserSettings) and getColor(Scene, Ray)
// - Hitable subclasses, hitByRay(Ray)
// - Material subclasses, getColor(HitInfo

import { HyperbolicBackground } from './hyperbolicBackground';
import { DiffuseMaterial } from './diffuseMaterial';
import { NormalMaterial } from './normalMaterial';
import { Scene, UserSettings } from './types';
import { HM } from './hm';
import { Ray } from './ray';
import { Vec } from './vec';
import { draw } from './draw';
import { Sphere } from './sphere';
import { setupSettingsGui } from './setupSettingsGui';


// user-editable settings

const pixelStep = 20;
const samples = 1;

const userSettings: UserSettings = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: 0.2, min: 0, max: 4, step: 0.1 },
    pixelStep: { name: "pixel step", initial: pixelStep, min: 1, max: 40, step: 1 },
    antialisingSamples: { name: "antialising samples", initial: samples, min: 1, max: 100, step: 1 }
};


// getSceneFromUserSettings() :: UserSettings => Scene

const sphereDistance = 10;

const viewportDistance = 10;

const cameraOrigin = new Vec(0, 0, 0, 0);

const cameraDirection = new Vec(0, 0, -1, 0);

const cameraUpDirection = new Vec(0, 1, 0, 0);

// const cameraUpDirection = new Vec(0.5, 1, 0, 0);

const dimu = 300;

const dimv = 300;

// const spheresXY = [[0, 0], [-0.2, -0.2], [0.2, 0]];//, [-0.4, -0.4], [0.4, 0], [-0.6, -0.6], [0.6, 0]];

const spheresXY = [[0, 0], [0, -100, -sphereDistance + 1, 100]];

const getSphereFromUserSettings:
    ((
    UserSettings,
    params:
    {
        id: string,
        centerX: number,
        centerY: number,
        centerZ?: number,
        radius?: number
    })
    => HM) =
    (userSettings, { centerX, centerY, centerZ, radius, id }) =>
        new HM(
            new Sphere(
                {
                    center: new Vec(centerX, centerY, centerZ || -sphereDistance, 0),
                    radius: radius || userSettings.radius,
                    id: id || Math.random() + ""
                }),
            new NormalMaterial());

const getSceneObjectsFromUserSettings:
    ((UserSettings) => HM[]) =
    (userSettings) =>
        spheresXY.map(
            (sphereXY, ix) =>
                getSphereFromUserSettings(
                    userSettings,
                    {
                        centerX: sphereXY[0],
                        centerY: sphereXY[1],
                        centerZ: sphereXY[2],
                        radius: sphereXY[3],
                        id: ix + ""
                    }));

const getSceneFromUserSettings:
    ((UserSettings) => Scene) =
    (userSettings) => ({
        dimu: dimu,
        dimv: dimv,
        camera: new Ray(cameraOrigin, cameraDirection),
        viewportDistance: viewportDistance,
        cameraUpDirection: cameraUpDirection,
        objects: getSceneObjectsFromUserSettings(userSettings),
        background: new HyperbolicBackground()
    });


// setup drawing canvas and get its context 'ctx'

const canvas: any = document.getElementById('canvas');

canvas.width = getSceneFromUserSettings(userSettings).dimu;

canvas.height = getSceneFromUserSettings(userSettings).dimv;

const ctx = canvas.getContext('2d');


// do the thing

const drawScene = () =>
    draw(
        ctx,
        getSceneFromUserSettings(userSettings),
        userSettings);

setupSettingsGui(userSettings, drawScene);

drawScene();




















