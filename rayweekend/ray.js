import { synonymize } from './misc';

const rayProto = {};
synonymize(rayProto, [["direction"], ["origin"]]);
rayProto.toString = function() {
    return JSON.stringify({ o: this.origin + "", d: this.direction + "" }).replace(/"/g, "");
}

export function ray(origin, direction) {
    const toReturn = Object.create(rayProto);

    toReturn._origin = origin;
    toReturn._direction = direction;

    return toReturn;
}

