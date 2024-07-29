import moment, { Moment } from "moment";

export function createMomentDateObject(dateInput: string | Moment) {
    let momentDateObject = moment(dateInput);
    return momentDateObject;
}

export function getFirstDayOfTheWeek(date: Moment): Moment {
    const dateReference = moment(date.format());
    let firstDayOfTheWeek = moment(dateReference.startOf('week').format());
    return firstDayOfTheWeek
}

export function getLastDayOfTheWeek(date: Moment): Moment {
    const dateReference = moment(date.format());
    let lastDayOfTheWeek = moment(dateReference.endOf('week').format());
    return lastDayOfTheWeek;
}

export function dateDifferenceInDays(startDate: Moment, finishDate: Moment): number {
    let dateDiff = finishDate.diff(startDate, 'days')
    return dateDiff;
}