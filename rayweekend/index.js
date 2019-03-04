// %USER_BACK%\btsync\books\cg\Ray Tracing in a Weekend.pdf

import { vec } from './vec';
import { ray } from './ray';
import { draw } from './drawing';
import { setupGui } from './misc';

const canvas = document.getElementById('canvas');

// u/v - uniform coordinate system of the viewport
// origin is top left, u goes left to right, v - top to bottom
// corresponds to browser's x/y, but we're using x/y/z for camera coordinate system

const ctx = canvas.getContext('2d');
const userSettings = {
    uvecX: { name: "X", initial: 2, min: -4, max: 4, step: 0.1 },
    vvecY: { name: "Y", initial: 2, min: -2, max: 2, step: 0.1 },
    radius: { name: "radius", initial: 0.2, min: 0, max: 4, step: 0.1 },
};

const sphere = () => ({
    type: "sphere",
    center: vec(0, 0, -1),
    radius: userSettings.radius
});

const scene = {
    dimu: 600,
    dimv: 600,
    objects: [sphere],
    ctx,
    userSettings
}


canvas.width = scene.dimu;
canvas.height = scene.dimv;

const doDraw = () => draw(scene, getColor);

setupGui(scene.userSettings, doDraw);

function intersectsSphere(tracedRay, sphere) {
    const radius = sphere.radius;
    const oc = tracedRay.origin.sub(sphere.center);
    const a = tracedRay.direction.dot(tracedRay.direction);
    const b = 2 * oc.dot(tracedRay.direction);
    const c = oc.dot(oc) - sphere.radius * sphere.radius;
    const disc = b * b - 4 * a * c;
    return disc >= 0;
}

function getColor(tracedRay) {
    for (const obj of scene.objects) {
        const resolved = obj();
        if (resolved.type === "sphere") {
            if (intersectsSphere(tracedRay, resolved)) {
                return vec(1, 0, 0);
            }
        }
    }

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
    const unitDirection = tracedRay.direction.normalize();
    const t = 0.5*(unitDirection.y + 1);
    const color = vec(0, 0, 0).interpolate(vec(1, 1, 1), t);
    return color;
    // (square (abs(x - 0.5)))*sgn(x - 0.5) + 0.5 from 0 to 1
//    if (color.r > 0.3 && color.r < 0.31) {
//        return vec(1, 0, 0);
//    } else if (color.r > 0.7 && color.r < 0.71) {
//        return vec(0, 1, 0);
//    } else if (color.r > 0.49 && color.r < 0.51) {
//        return vec(1, 1, 1);
//    } else if (color.r > 0.8 && color.r < 0.81) {
//        return vec(0, 0, 1);
//    }
//    return vec();
}



doDraw();