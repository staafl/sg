// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf

// the meat of the thing is in draw.ts, functions draw and getColor

import { Scene, UserSettings } from './types';
import { Ray } from './ray';
import { Vec } from './vec';
import { draw } from './draw';
import { Sphere } from './sphere';
import { setupSettingsGui } from './setupSettingsGui';


// user-editable settings

const userSettings: UserSettings = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: 0.2, min: 0, max: 4, step: 0.1 },
};


// scene

const sphereDistance = 10;
const fov = 10;

const getSphere = (userSettings, ox, oy) => new Sphere(
    new Vec(0 + ox, 0 + oy, -sphereDistance, 0),
    userSettings.radius);

const getScene: (UserSettings) => Scene =
    userSettings => ({
        dimu: 600,
        dimv: 600,
        camera: new Ray(new Vec(0, 0, 0, 0), new Vec(0, 0, -1, 0)),
        fov: fov,
        up: new Vec(0, 1, 0, 0),
        objects: [
            getSphere(userSettings, 0, 0),
            getSphere(userSettings, -0.2, -0.2),
            getSphere(userSettings, 0.2, 0),
            getSphere(userSettings, -0.4, -0.4),
            getSphere(userSettings, 0.4, 0),
            getSphere(userSettings, -0.6, -0.6),
            getSphere(userSettings, 0.6, 0),
        ]
    });


// drawing canvas

const canvas: any = document.getElementById('canvas');
canvas.width = getScene(userSettings).dimu;
canvas.height = getScene(userSettings).dimv;

const ctx = canvas.getContext('2d');


// do the thing

const drawScene = () => draw(ctx, getScene(userSettings), userSettings);

setupSettingsGui(userSettings, drawScene);

drawScene();