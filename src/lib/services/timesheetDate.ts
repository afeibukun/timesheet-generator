import moment, { Moment } from "moment";

interface TimesheetDateInterface {
    year: number,
    month: number,
    day: number,
    dateObject: any;
}

export class TimesheetDate implements TimesheetDateInterface {
    dateObject: Moment
    year: number;
    month: number;
    day: number;

    constructor(timesheetDateInput: string | Moment | TimesheetDate) {
        if (timesheetDateInput instanceof TimesheetDate) {
            timesheetDateInput = timesheetDateInput.dateObject;
        }
        let momentTimesheetDate = moment(timesheetDateInput);
        this.year = momentTimesheetDate.year();
        this.month = momentTimesheetDate.month();
        this.day = momentTimesheetDate.day();
        this.dateObject = momentTimesheetDate
    }

    getFirstDayOfTheWeek(): TimesheetDate {
        const dateReference = moment(this.dateObject.format());
        let firstDayOfTheWeek = moment(dateReference.startOf('week').format());
        return new TimesheetDate(firstDayOfTheWeek);
    }

    getLastDayOfTheWeek(): TimesheetDate {
        const dateReference = moment(this.dateObject.format());
        let lastDayOfTheWeek = moment(dateReference.endOf('week').format());
        return new TimesheetDate(lastDayOfTheWeek);
    }

    isDateSameOrBefore(secondDate: TimesheetDate): boolean {
        return this.dateObject.isSameOrBefore(secondDate.dateObject)
    }

    isDateBetween(startDate: TimesheetDate, finishDate: TimesheetDate): boolean {
        return this.dateObject.isBetween(startDate.dateObject, finishDate.dateObject, 'day', '[]');
    }

    defaultFormat(): string {
        return this.dateObject.format();
        // Sample Outcome - 2017-03-06T00:00:00+01:00
    }

    simpleFormat(): string {
        return this.dateObject.format('ddd, DD MMM YYYY');
        // Sample Outcome - Mon, 06 Mar 2017
    }

    dateInputNaturalFormat(): string {
        return this.dateObject.format('YYYY-MM-DD');
        // Sample Outcome - 2017-03-13
    }

    weekNumber(): number {
        return this.dateObject.week();
    }

    dateIncrementByDay(numberOfDays: number) {
        return new TimesheetDate(this.dateObject.add(numberOfDays, 'day'));
    }
}