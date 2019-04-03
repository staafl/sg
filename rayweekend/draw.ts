import { calculateViewport } from './calculateViewport';
import { Scene, UserSettings, HitInfo } from './types';
import { Ray } from './ray';
import { rayCast } from './rayCast';
import { Vec } from './vec';

export function draw(ctx: any, scene: Scene, userSettings: UserSettings) {

    const started = new Date().getTime();

    clearCanvas(ctx, scene.dimu, scene.dimv);

    // prepare to cast rays; each ray will produce the color of 1 pixel
    // (or an QxQ square of pixels where Q = step)
    
    // first, figure out the viewport

    const { cameraPosition, upperLeft, uvec, vvec } = calculateViewport(scene, userSettings);
    
    // how, produce the rays and use them to get the pixel colors

    const step = userSettings.pixelStep;

    const samples = userSettings.antialisingSamples;

    const samplesRoot = Math.sqrt(samples);

    for (let uu = 0; uu < scene.dimu; uu += step) {
        setTimeout(function() {

            for (let vv = 0; vv < scene.dimv; vv += step) {

                const colors = [];

                for (let us = 0; us < samplesRoot; ++us) {

                    for (let vs = 0; vs < samplesRoot; ++vs) {
                        // for each (uu, vv) pixel in the viewport

                        const ur = (uu + (step / 2) + us/samplesRoot) / scene.dimu; // [0;1)

                        const vr = (vv + (step / 2) + vs/samplesRoot) / scene.dimv; // [0;1)

                        // create a ray from the camera to the pixel

                        const ray = new Ray(
                            cameraPosition,
                            upperLeft.add(uvec.scale(ur), vvec.scale(vr)));

                        const color = rayCast(ray, scene, userSettings, { uu, vv, depth: 0 }).color;

                        colors.push(color);
                    }
                }

                const averageColor = Vec.average(colors);
                drawPixel(ctx, uu, vv, averageColor, step);
            }
        },
        1);
    }

    console.log(`drawing done: ${new Date().getTime() - started} ms`);
}

function clearCanvas(ctx, dimu, dimv) {

    ctx.clearRect(0, 0, dimu, dimv);

    ctx.fillStyle = '#cccccc';

    ctx.fillRect(0, 0, dimu, dimv);

}

function drawPixel(ctx, x, y, color, step) {

    const colorFactor = 255.99;

    // can the choice of multiplication factor influence
    // the final rounded color value?

    // let x be the whole part of the multiplied number, y - the fractional part
    // ((x + y) / 256) * (256 - 255.99) > y
    // (x + y) * 0.01/256 > y
    // x > 255.99y
    // answer: yes
    //
    // examples:
    // (1)
    // 256 * 0.53517 => 137.00352
    // 255.99 * 0.53517 => 136.9981683
    //
    // (2)
    // 120.001 / 256 => 0.46875390625
    // 0.46875390625 * 255.99 => 119.996312460938

    const fill = "rgb(" +
                    Math.floor(color.r * colorFactor) + "," +
                    Math.floor(color.g * colorFactor) + "," +
                    Math.floor(color.b * colorFactor) + ")";

    ctx.fillStyle = fill

    //if (x % 10 === 0 && y % 10 === 0) {
    //    console.log(JSON.stringify({ x, y, fill }));
    //}
    ctx.fillRect(x, y, step, step);
}
