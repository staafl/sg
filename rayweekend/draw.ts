import { Scene, UserSettings, HitInfo } from './types';
import { Vec } from './vec';
import { Ray } from './ray';

export function draw(ctx: any, scene: Scene, userSettings: UserSettings) {

    const started = new Date().getTime();

    clearCanvas(ctx, scene.dimu, scene.dimv);
    
    const step = Math.floor(100 / (userSettings.quality || 100));

    // prepare to cast rays; each ray will produce the color of 1 pixel
    // (or an QxQ square of pixels where Q = step)
    // first, figure out the viewport
    const cameraPosition = scene.camera.origin;
    const cameraDir = scene.camera.direction.normalize();
    const cameraUpDir = scene.cameraUpDirection.normalize();

    const viewportRightDir = cameraDir.cross(cameraUpDir).normalize();
    const viewportCenter = cameraPosition.add(cameraDir.scale(scene.viewportDistance));

    // upper left corner of the viewport in world coordinate system
    const upperLeft = viewportCenter.add(
        viewportRightDir.neg(),
        cameraUpDir);

    // vectors used to trace out pixels on the viewport;
    // such that upperLeft + vvec + vvec = new Vec(-upperLeft.x, -upperLeft.y, upperLeft.z),
    // i.e. the right lower corner
    const uvec = viewportCenter.add(viewportRightDir.scale(userSettings.uvecX)).setZ(0);
    const vvec = viewportCenter.add(cameraUpDir.scale(userSettings.vvecY).neg()).setZ(0);

    console.log(
        "Viewport calculations",
        { upperLeft, uvec, vvec, viewportRightDir, viewportCenter });

    // the actual ray casting happens here
    const samples = 4;
    const samplesRoot = Math.sqrt(samples);
    for (let uu = 0; uu < scene.dimu; uu += step) {
        setTimeout(function() {
            for (let vv = 0; vv < scene.dimv; vv += step) {
                const colors = [];
                for (let us = 0; us < samplesRoot; ++us) {
                    for (let vs = 0; vs < samplesRoot; ++vs) {
                        // for each (uu, vv) pixel in the viewport

                        const ur = (uu + us/samplesRoot) / scene.dimu; // [0;1)
                        const vr = (vv + vs/samplesRoot) / scene.dimv; // [0;1)

                        // create a ray from the camera to the pixel

                        const tracedRay = new Ray(
                            cameraPosition,
                            upperLeft.add(uvec.scale(ur), vvec.scale(vr)));

                        const color = getColor(scene, tracedRay, userSettings);
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


function getColor(scene: Scene, tracedRay: Ray, userSettings: UserSettings): Vec {
    const cameraPosition = scene.camera.origin;
    let closestHit: HitInfo = null;
    let closestHitDistance: number = undefined;

    for (const hm of scene.objects) {
        const thisHit = hm.hitable.hitByRay(tracedRay);

        if (!thisHit) {
            continue;
        }

        const thisHitDistance = thisHit.hitPoint.sub(cameraPosition).length;

        if (closestHitDistance === undefined ||
            closestHitDistance > thisHitDistance) {
            closestHit = thisHit;
            closestHitDistance = thisHitDistance;
        }
    }

    if (closestHit) {
        return closestHit.hm.material.getColor(
            closestHit,
            scene);
    }
    
    if (scene.background) {
        return scene.background.getColor(scene, tracedRay, userSettings);
    }

    return new Vec(0, 0, 0, 0);
}

function clearCanvas(ctx, dimu, dimv) {
    ctx.clearRect(0, 0, dimu, dimv);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, dimu, dimv);
}

function drawPixel(ctx, x, y, color, step) {
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
    ctx.fillRect(x, y, step, step);
}
