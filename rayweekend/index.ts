// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf

// the meat of the thing is in draw.ts, functions draw and getColor

import { Scene, UserSettings } from './types';
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

const getCenterSphere = (userSettings) => new Sphere(
    new Vec(0, 0, -1, 0),
    userSettings.radius);

const getScene: (UserSettings) => Scene = 
    userSettings => ({
        dimu: 600,
        dimv: 600,
        objects: [getCenterSphere(userSettings)]
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