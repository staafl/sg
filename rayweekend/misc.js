// from [x, r, e1] defines properties x => _x, r => _x, e1 => _x
export function synonymize(obj, synonyms) {
    for (const synonymSet of synonyms) {
        const main = synonymSet[0];
        for (const other of synonymSet) {
            Object.defineProperty(
                obj,
                other,
                {
                    get: function() {
                        return this["_" + main];
                    }
                });
        }
    }
}

export function setupGui(userSettings, onChange) {
	var gui = new dat.GUI();

    var listen = ctrl => ctrl.onFinishChange(x => onChange);

    for (const key of Object.keys(userSettings)) {
        const userSetting = userSettings[key];
        userSettings[key] = userSetting.initial
        const step = userSetting.step || (userSettings.max - userSettings.min / 100);
        const newSetting = gui.add(
            userSettings,
            key,
            userSetting.min,
            userSetting.max)
            .step(step)
            .name(userSetting.name || key);

        listen(newSetting);
    }
}