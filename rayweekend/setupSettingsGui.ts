import { UserSettings } from './types';

declare const dat: any;

export function setupSettingsGui(userSettings: UserSettings, onChange: (any) => void) {
	const gui = new dat.GUI();

	(window as any).__nogc = (window as any).__nogc || {};
	(window as any).__nogc.gui = gui;

    const userSettingsCache = {};

    for (const key of Object.keys(userSettings)) {
        const userSetting = userSettings[key];
        userSettings[key] = userSetting.initial
        userSettingsCache[key] = userSetting.initial
        const step = userSetting.step || (userSetting.max - userSetting.min / 100);
        const thisSettingObject = gui.add(
            userSettings,
            key,
            userSetting.min,
            userSetting.max)
            .step(step)
            .name(userSetting.name || key);

        thisSettingObject.onFinishChange((value) => {
            const oldValue = userSettingsCache[key];
            if (value !== oldValue) {
                userSettingsCache[key] = value;
                onChange({ key, value, oldValue });
            }
        });
    }

    window.addEventListener(
        'load',
        function() {

            setTimeout(
                function() {
                    for (const dg of document.querySelectorAll("div.dg.main.a")) {
                        (dg as any).style.width = "500px";
                    }
                },
                1000);

        });
}
