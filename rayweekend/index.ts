// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf

// interesting places:
// - draw.ts, draw(Context, Scene, UserSettings)
// - rayCast.ts, rayCast(Scene, Ray)
// - Hitable subclasses, hitByRay(Ray)
// - Material subclasses, getColor(HitInfo

import { calculateViewport } from './calculateViewport';
import { draw } from './draw';
import { DiffuseMaterial } from './diffuseMaterial';
import { Global } from './global';
import { HM } from './hm';
import { HyperbolicBackground } from './hyperbolicBackground';
import { NormalMaterial } from './normalMaterial';
import { Ray } from './ray';
import { rayCast } from './rayCast';
import { setupSettingsGui } from './setupSettingsGui';
import { Sphere } from './sphere';
import { Scene, UserSettings } from './types';
import { Vec } from './vec';


declare const CircularJSON: any;

const pick = (ar, id) => {
    if (id) {
        if (!isNaN(id)) {
            return ar[Number(id) % ar.length];
        } else if (typeof id === "string") {
            let ix = 0;
            for (const ch of id) {
                ix += ch.charCodeAt(0);
            }
            return ar[ix % ar.length];
        }
    }

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


const ndump = (...args) => {
    return args[0];
};

const dump = (...args) => {
    console.log(...args);
    return args[0];
};

const firstDefined = (...args) => {
    for (const arg of args) {
        if (arg !== undefined) {
            return arg;
        }
    }
    return undefined;
}



// user-editable settings

const scale = 2;

const pixelStep =
    scale *
    //10;
    2;
    
const samples =
    //1;
    4;

const initialRadius = 0.5;
//const initialRadius = 10;

const userSettingsTemplate: UserSettings = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: initialRadius, min: 0, max: 40, step: 0.1 },
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

const dimu = scale * 300;

const dimv = scale * 300;

// const sphereDefs = [[0, 0], [-0.2, -0.2], [0.2, 0]];//, [-0.4, -0.4], [0.4, 0], [-0.6, -0.6], [0.6, 0]];

const bigRadius = 20;
const bigY = -bigRadius - initialRadius + 0.5;
const bigZ = dump(Math.sqrt((bigRadius + initialRadius) * (bigRadius + initialRadius) - bigY * bigY), "bigZ");
dump({ bigZ, bigY, bigRadius, initialRadius }, "spheres");
dump(bigY * bigY + bigZ * bigZ, "stuff");
dump(Math.sqrt(bigY * bigY + bigZ * bigZ) - bigRadius - initialRadius, "error");
const sphereDefs: any[] = [[0, 0], { x: 0, y: bigY, z: bigZ, r: bigRadius}];
// const sphereDistance = 300;
// const sphereDefs: any[] = [[0, 0], { x: 0, y: -500, z: -sphereDistance - 90, r: 500 }];

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
                    center: ndump(new Vec(centerX, centerY, centerZ || -sphereDistance, 0), "c"),
                    radius: ndump(radius || userSettings.radius, "r"),
                    id: ndump(id || Math.random() + "", "id")
                }),
                //new NormalMaterial()
            new DiffuseMaterial(
            {
                color: color || pick(colors, id) || Vec.random(),
                absorption: userSettings.diffuseAbsorption
            })
            );

const getSceneObjectsFromUserSettings:
    ((UserSettings) => HM[]) =
    (userSettings) =>
        sphereDefs.map(
            (sphereDef, ix) =>
                getSphereFromUserSettings(
                    userSettings,
                    {
                        ...sphereDef,
                        centerX: firstDefined(sphereDef.x, sphereDef[0]),
                        centerY: firstDefined(sphereDef.y, sphereDef[1]),
                        centerZ: firstDefined(sphereDef.z, sphereDef[2]),
                        radius: firstDefined(sphereDef.r, sphereDef[3]),
                        id: firstDefined(sphereDef.id, sphereDef[4], ix + ""),
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

canvas.width = dimu;

canvas.height = dimv;

const ctx = canvas.getContext('2d');


// do the thing

let userSettings;

const drawScene = () =>
    draw(
        ctx,
        getSceneFromUserSettings(userSettings),
        userSettings);

userSettings = setupSettingsGui(userSettingsTemplate, drawScene);

drawScene();

const hitinfoElem: any = document.getElementById('hitinfo');

canvas.addEventListener(
    'mousemove',
    function(evt) {
        // hitinfoElem.innerText = evt.offsetX + " " + evt.offsetY;
        const { scene, userSettings } = Global.lastDrawn;
        if (!scene) {
            return;
        }
        const { upperLeft, uvec, vvec } = calculateViewport(scene, userSettings);
        const ray = new Ray(
            scene.camera.origin,
            upperLeft.add(
                uvec.scale(evt.offsetX / scene.dimu),
                vvec.scale(evt.offsetY / scene.dimv)));
        const ch = rayCast(ray, scene, userSettings, { depth: 0 });
        const scaledColor = ch.color.scale(255.99);
        hitinfoElem.innerText = JSON.stringify({
            x: evt.offsetX,
            y: evt.offsetY,
            color: {
                r: Math.floor(scaledColor.x),
                g: Math.floor(scaledColor.y),
                b: Math.floor(scaledColor.z),
            },
            id: ch.hit && ch.hit.hm && ch.hit.hm.hitable.id
        });
    });



















