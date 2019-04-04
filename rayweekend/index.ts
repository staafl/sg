// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf

// interesting places:
// - draw.ts, draw(Context, Scene, UserSettings)
// - rayCast.ts, rayCast(Scene, Ray)
// - Hitable subclasses, hitByRay(Ray)
// - Material subclasses, getColor(HitInfo

import { calculateViewport } from './calculateViewport';
import { draw } from './draw';
import { DiffuseMaterial } from './diffuseMaterial';
import { HM } from './hm';
import { HyperbolicBackground } from './hyperbolicBackground';
import { NormalMaterial } from './normalMaterial';
import { Ray } from './ray';
import { rayCast } from './rayCast';
import { setupSettingsGui } from './setupSettingsGui';
import { Sphere } from './sphere';
import { Scene, UserSettings } from './types';
import { Vec } from './vec';


// user-editable settings

const pixelStep = 
    10;
    //2;
const samples =
    1;
    //4;

const userSettings: UserSettings = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: 0.2, min: 0, max: 4, step: 0.1 },
    pixelStep: { name: "pixel step", initial: pixelStep, min: 1, max: 40, step: 1 },
    antialisingSamples: { name: "antialising samples", initial: samples, min: 1, max: 100, step: 1 },
    diffuseAbsorption: { name: "diffuse absorption", initial: 0.5, min: 0, max: 1, step: 0.1 },
    maxDiffuseBounces: { name: "max diffuse bounces", initial: 2, min: 1, max: 10, step: 1 }
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

const spheresXY = [[0, 0], [0, -100, -sphereDistance - 100, 100]];

const pick = (ar) => {
    if (ar._ix === undefined) {
        ar._ix = 0;
    } else {
        ar._ix += 1;
        ar._ix %= ar.length;
    }
    const toReturn = ar[ar._ix];
    // return ar[Math.floor(Math.random() * ar.length)];
    console.log(toReturn);
    return toReturn;
}

const colors = [new Vec(1, 0, 0, 0), new Vec(1, 1, 0, 0)];

const getSphereFromUserSettings:
    ((
    UserSettings,
    params:
    {
        id: string,
        centerX: number,
        centerY: number,
        centerZ?: number,
        radius?: number,
        color?: Vec
    })
    => HM) =
    (userSettings, { centerX, centerY, centerZ, radius, id, color }) =>
        new HM(
            new Sphere(
                {
                    center: new Vec(centerX, centerY, centerZ || -sphereDistance, 0),
                    radius: radius || userSettings.radius,
                    id: id || Math.random() + ""
                }),
                new NormalMaterial()
//            new DiffuseMaterial(
//            {
//                color: color || Vec.random() || pick(colors),
//                absorption: userSettings.diffuseAbsorption
//            })
            );

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

const scene = getSceneFromUserSettings(userSettings);
const drawScene = () =>
    draw(
        ctx,
        scene,
        userSettings);

setupSettingsGui(userSettings, drawScene);

drawScene();

const hitinfoElem: any = document.getElementById('hitinfo');

canvas.addEventListener(
    'mousemove',
    function(evt) {
        // hitinfoElem.innerText = evt.offsetX + " " + evt.offsetY;
        const { upperLeft, uvec, vvec } = calculateViewport(scene, userSettings);
        const ray = new Ray(
            scene.camera.origin,
            upperLeft.add(
                uvec.scale(evt.offsetX / scene.dimu),
                vvec.scale(evt.offsetY / scene.dimv)));
        const ch = rayCast(ray, scene, userSettings, { depth: 0 });
        hitinfoElem.innerText = JSON.stringify({
            x: evt.offsetX,
            y: evt.offsetY,
            color: ch.color,
            id: ch.hit && ch.hit.hm && ch.hit.hm.hitable.id
        });
    });
    


















