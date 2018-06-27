import { dateStringToInt, timeToMinutes, calculateDuration, intToDateString, dateToString, getCurrentDateString } from './utils';

it('parses time string to integer minutes', () => {
    expect(timeToMinutes('10-30')).toEqual(630);
});

it('calculates duration before start time and end time', () => {
    expect(calculateDuration('10-30', '11-45')).toEqual(75);
});

it('converts string date to integer number', () => {
    expect(dateStringToInt('2018-06-01')).toEqual(20180601);
});

it('converts integer number to string date', () => {
    expect(intToDateString(20180601)).toEqual('2018-06-01');
});

it('converts date to date string', () => {
    const dateSample = new Date('2018-06-01');
    expect(dateToString(dateSample)).toEqual('2018-06-01');
});

it('returns current date in date string format', () => {
    expect(dateToString(new Date())).toEqual(getCurrentDateString());
});