import { getCurrentDateString } from '/utils/utils.js';

let currentSettings;

export function saveSettings(settings = currentSettings) {
    window.localStorage.setItem('settings', JSON.stringify(settings));
    currentSettings = settings;
}

function loadSettings() {
    const settings = window.localStorage.getItem('settings');
    if (settings) {
        return JSON.parse(taskTree);
    }

    return {
        endOfDay: '21-00',
        currentSelectedDate: getCurrentDateString(),
    };
}

export function getSettings() {
    if (currentSettings) return currentSettings;
    currentSettings = loadSettings();
    return currentSettings;
}