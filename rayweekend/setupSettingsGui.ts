import { UserSettings } from './types';

declare const dat: any;

export function setupSettingsGui(userSettings: UserSettings, onChange: () => void) {
	const gui = new dat.GUI();

    for (const key of Object.keys(userSettings)) {
        const userSetting = userSettings[key];
        userSettings[key] = userSetting.initial
        const step = userSetting.step || (userSetting.max - userSetting.min / 100);
        const newSetting = gui.add(
            userSettings,
            key,
            userSetting.min,
            userSetting.max)
            .step(step)
            .name(userSetting.name || key);

        newSetting.onFinishChange(x => onChange);
    }
}
