import { Background, Scene, UserSettings } from './types';
import { Ray } from './ray';
import { Vec } from './vec';

export class HyperbolicBackground implements Background
{
    getColor(ray: Ray, scene: Scene, userSettings: UserSettings)
    {
        // among all rays that hit the viewport at a given vv', the one with the highest
        // normalized abs(y) is the one with x = 0 (the one going directly towards the viewport)
        // all vectors from the origin have the same non-normalized y (=vv'), divided by a length
        // >= sqrt(vv'^2 + z^2), with equality only when x = 0
        //
        // imagine a cone with a vertex at the origin (i.e. rays with a given 'y') intersecting a
        // plane (the viewport plane) - you get a hyperbola
        //
        // vv' = y/sqrt(x^2 + y^2 + z'^2) (z' and vv' are parameters)
        // vv'^2*z'^2 = y^2*(1-vv'^2) - x^2 (which is a hyperbolic formula)
        // y = +/- sqrt(param + x^2)/param => y has maximum abs when x = 0
        //
        // this is why the resulting gradient is dimmest in the middle and gets brighter at the sides
        // (bottom half), or is brightest in the middle and dims towards the sides (top half)
        // - points with equal lumosity are on a hyperbola with vertex in the vertical midline
        // of the viewport
        //
        // among rays with x=0, the highest normalized y is the one hitting at the highest vv, so
        // the brightest place is the top center; analogously, the dimmest place is the bottom center
        const unitDir = ray.direction.normalize();
        const t = 0.5*(unitDir.y + 1);
        const color = new Vec(0, 0, 0, 0).interpolate(new Vec(1, 1, 1, 0), t);
        return color;
        
        /*
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
*/
    }
}