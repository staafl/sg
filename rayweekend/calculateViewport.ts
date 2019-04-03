import { Scene, UserSettings } from './types'
import { Vec } from './vec';

export function calculateViewport(scene: Scene, userSettings: UserSettings) {

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

    return {
        upperLeft,
        cameraPosition,
        cameraDir,
        cameraUpDir,
        viewportRightDir,
        viewportCenter,
        uvec,
        vvec
    };
}