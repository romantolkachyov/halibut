import { getSettings } from '/storage/SettingsStorage.js';

/*
timemark 'XX-XX'
timesheet: 
    endOfDay: timemark,
    rows: 
        (
            time: timemark
            taskId: number
            description: string
        )[]
*/

export function loadTimesheet(dateString) {
    const timesheet = window.localStorage.getItem(`timesheet_${dateString}`);
    if (timesheet) {
        return JSON.parse(taskTree);
    }
    return {
        endOfDay: getSettings().endOfDay,
        rows: [], 
    };
}