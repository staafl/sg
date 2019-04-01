import { Scene, UserSettings, HitInfo } from './types';
import { Vec } from './vec';
import { Ray } from './ray';

export function draw(ctx: any, scene: Scene, userSettings: UserSettings) {

    const started = new Date().getTime();

    clearCanvas(ctx, scene.dimu, scene.dimv);

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
    for (let u = 0; u < scene.dimu; u += 1) {
        setTimeout(function() {
            for (let v = 0; v < scene.dimv; v += 1) {
                const colors = [];
                for (let us = 0; us < samplesRoot; ++us) {
                    for (let vs = 0; vs < samplesRoot; ++vs) {
                        // for each (u, v) pixel in the viewport

                        const ur = (u + us/samplesRoot) / scene.dimu; // [0;1)
                        const vr = (v + vs/samplesRoot) / scene.dimv; // [0;1)

                        // create a ray from the camera to the pixel

                        const tracedRay = new Ray(
                            cameraPosition,
                            upperLeft.add(uvec.scale(ur), vvec.scale(vr)));

                        const color = getColor(scene, tracedRay);
                        colors.push(color);
                    }
                }

                const averageColor = Vec.average(colors);
                drawPixel(ctx, u, v, averageColor);
            }
        },
        1);
    }

    console.log(`drawing done: ${new Date().getTime() - started} ms`);
}


function getColor(scene: Scene, tracedRay: Ray): Vec {
    const cameraPosition = scene.camera.origin;
    let closestHit: HitInfo = null;
    let closestHitDistance: number = undefined;
    for (const hm of scene.objects) {
        const hit = hm.hitable.hitByRay(tracedRay);

        if (hit) {
                let thisHitDistance;

                if (closestHitDistance === undefined ||
                    closestHitDistance >
                        (thisHitDistance = hit.hitPoint.sub(cameraPosition).length)) {
                closestHit = hit;
                closestHitDistance = thisHitDistance;
            }
        }
    }

    if (closestHit) {
        return closestHit.hm.material.getColor(
            closestHit,
            scene);
    }

    // background: hyperbolic gradient
    // among all rays that hit the viewport at a given v', the one with the highest
    // normalized abs(y) is the one with x = 0 (the one going directly towards the viewport)
    // all vectors from the origin have the same non-normalized y (=v'), divided by a length
    // >= sqrt(v'^2 + z^2), with equality only when x = 0
    //
    // imagine a cone with a vertex at the origin (i.e. rays with a given 'y') intersecting a
    // plane (the viewport plane) - you get a hyperbola
    //
    // v' = y/sqrt(x^2 + y^2 + z'^2) (z' and v' are parameters)
    // v'^2*z'^2 = y^2*(1-v'^2) - x^2 (which is a hyperbolic formula)
    // y = +/- sqrt(param + x^2)/param => y has maximum abs when x = 0
    //
    // this is why the resulting gradient is dimmest in the middle and gets brighter at the sides
    // (bottom half), or is brightest in the middle and dims towards the sides (top half)
    // - points with equal lumosity are on a hyperbola with vertex in the vertical midline
    // of the viewport
    //
    // among rays with x=0, the highest normalized y is the one hitting at the highest v, so
    // the brightest place is the top center; analogously, the dimmest place is the bottom center
    const unitDir = tracedRay.direction.normalize();
    const t = 0.5*(unitDir.y + 1);
    const color = new Vec(0, 0, 0, 0).interpolate(new Vec(1, 1, 1, 0), t);
    return color;


//    another way to get increasingly rapid change of value away from the midline
//    (square (x - k))*sgn(x - k) + k from 0 to 2k

//    you can draw hyperbolic strips of approximately equal brightness
//    using the below
//    if (color.r > 0.3 && color.r < 0.31) {
//        return new Vec(1, 0, 0);
//    } else if (color.r > 0.7 && color.r < 0.71) {
//        return new Vec(0, 1, 0);
//    } else if (color.r > 0.49 && color.r < 0.51) {
//        return new Vec(1, 1, 1);
//    } else if (color.r > 0.8 && color.r < 0.81) {
//        return new Vec(0, 0, 1);
//    }
//    return new Vec();
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
