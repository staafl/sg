import { vec } from './vec';
import { ray } from './ray';

export function draw(scene, getColor) {

    const started = new Date().getTime();

    clearCanvas(scene.ctx, scene.dimu, scene.dimv);

    // our camera
    const origin = vec();

    // lower left corner of the viewport in camera coordinate system
    const lowerLeft = vec(-1, -1, -1);

    // such that lowerLeft + vvec + vvec = vec(-lowerLeft.x, -lowerLeft.y, lowerLeft.z);
    const uvec = vec(scene.userSettings.uvecX, 0, 0);
    const vvec = vec(0, scene.userSettings.vvecY, 0);

    for (let u = 0; u < scene.dimu; u += 1) {
        for (let v = 0; v < scene.dimv; v += 1) {
            const ur = u / scene.dimu; // [0;1)
            const vr = v / scene.dimv; // [0;1)

            // a ray from the camera to a pixel in the viewport
            const tracedRay = ray(origin, lowerLeft.add(uvec.scale(ur), vvec.scale(vr)));

            const color = getColor(tracedRay);

            drawPixel(scene.ctx, u, v, color);
        }
    }

    console.log(`drawing done: ${new Date().getTime() - started} ms`);
}

export function clearCanvas(ctx, dimu, dimv) {
    ctx.clearRect(0, 0, dimu, dimv);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, dimu, dimv);
}

export function drawPixel(ctx, x, y, color) {
    // ((x + y) / 256) * (256 - 255.99) > y
    // (x + y) * 0.01/256 > y
    // x > 255.99y
    //
    // 256 * 0.53517 => 137.00352
    // 255.99 * 0.53517 => 136.9981683
    // 120.001 / 256 => 0.46875390625
    // 0.46875390625 * 255.99 => 119.996312460938
    const fill = "rgb(" +
                    Math.floor(color[0] * 255.99) + "," +
                    Math.floor(color[1] * 255.99) + "," +
                    Math.floor(color[2] * 255.99) + ")";

    ctx.fillStyle = fill

    //if (x % 10 === 0 && y % 10 === 0) {
    //    console.log(JSON.stringify({ x, y, fill }));
    //}
    ctx.fillRect(x, y, 1, 1);
}
