import { Vec } from './vec';
import { Scene, UserSettings } from './types';
import { Ray } from './ray';

export function draw(ctx: any, scene: Scene, getColor: (Scene, Ray) => Vec, userSettings: UserSettings) {

    const started = new Date().getTime();

    clearCanvas(ctx, scene.dimu, scene.dimv);

    // our camera
    const origin = new Vec(0, 0, 0, 0);

    // lower left corner of the viewport in camera coordinate system
    const lowerLeft = new Vec(-1, -1, -1, 0);

    // such that lowerLeft + vvec + vvec = new Vec(-lowerLeft.x, -lowerLeft.y, lowerLeft.z);
    const uvec = new Vec(userSettings.uvecX, 0, 0, 0);
    const vvec = new Vec(0, userSettings.vvecY, 0, 0);

    for (let u = 0; u < scene.dimu; u += 1) {
        for (let v = 0; v < scene.dimv; v += 1) {
            const ur = u / scene.dimu; // [0;1)
            const vr = v / scene.dimv; // [0;1)

            // a ray from the camera to a pixel in the viewport
            const tracedRay = new Ray(origin, lowerLeft.add(uvec.scale(ur), vvec.scale(vr)));

            const color = getColor(scene, tracedRay);

//            if (u % 100 == 0 && v % 100 == 0)
//            {
//                console.log(u, v, color)
//            }
            drawPixel(ctx, u, v, color);
        }
    }

    console.log(`drawing done: ${new Date().getTime() - started} ms`);
}

function clearCanvas(ctx, dimu, dimv) {
    ctx.clearRect(0, 0, dimu, dimv);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, dimu, dimv);
}

function drawPixel(ctx, x, y, color) {
    // ((x + y) / 256) * (256 - 255.99) > y
    // (x + y) * 0.01/256 > y
    // x > 255.99y
    //
    // 256 * 0.53517 => 137.00352
    // 255.99 * 0.53517 => 136.9981683
    // 120.001 / 256 => 0.46875390625
    // 0.46875390625 * 255.99 => 119.996312460938
    const fill = "rgb(" +
                    Math.floor(color.r * 255.99) + "," +
                    Math.floor(color.g * 255.99) + "," +
                    Math.floor(color.b * 255.99) + ")";

    ctx.fillStyle = fill

    //if (x % 10 === 0 && y % 10 === 0) {
    //    console.log(JSON.stringify({ x, y, fill }));
    //}
    ctx.fillRect(x, y, 1, 1);
}
