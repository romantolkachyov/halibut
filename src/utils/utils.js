export function dateStringToInt(date) {
    // '2018-06-01' -> 20180601
    return parseInt(date.replace(/-/mg, ''))   
}

export function intToDateString(intDate) {
    // 20180601 -> '2018-06-01'
    const tempStringDate = intDate.toString();
    const year = tempStringDate.slice(0,4);
    const month = tempStringDate.slice(4,6);
    const day = tempStringDate.slice(6,8);
    return [year, month, day].join('-');
}

export function timeToMinutes(time) {
    // '10-30' => 630
    const [hours, minutes] = time.split('-');
    return parseInt(hours) * 60 + parseInt(minutes);
}

export function calculateDuration(startTime, endTime) {
    // '12-30' ... '13-45' = 75
    return timeToMinutes(endTime) - timeToMinutes(startTime);
}

export function dateToString(date) {
    return date.toISOString().slice(0,10);
}

export function getCurrentDateString() {
    return dateToString(new Date());
}