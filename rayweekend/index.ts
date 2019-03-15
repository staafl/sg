// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf

import { Scene, UserSettings } from './types';
import { getColor } from './getColor';
import { Vec } from './vec';
import { draw } from './draw';
import { Sphere } from './sphere';
import { setupSettingsGui } from './setupSettingsGui';

const getCenterSphere = (userSettings) => new Sphere(
    new Vec(0, 0, -1, 0),
    userSettings.radius);

const userSettings: UserSettings = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: 0.2, min: 0, max: 4, step: 0.1 },
};

const getScene: (UserSettings) => Scene = 
    userSettings => ({
        dimu: 600,
        dimv: 600,
        objects: [getCenterSphere(userSettings)]
    });


const canvas: any = document.getElementById('canvas');
canvas.width = getScene(userSettings).dimu;
canvas.height = getScene(userSettings).dimv;

const ctx = canvas.getContext('2d');

const drawScene = () => draw(ctx, getScene(userSettings), getColor, userSettings);

setupSettingsGui(userSettings, drawScene);

drawScene();