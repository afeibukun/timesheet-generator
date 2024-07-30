import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { TimesheetMeta } from "./timesheetMeta";

export type TimesheetDefaultInformation = {
    startTime: string,
    finishTime: string,
    locationType: string,
    comment: string,
    weekStartDay: string,
    updatedAt: string,
}

interface TimesheetEntryInterface {
    id: number,
    date: TimesheetDate,
    entryPeriod: TimesheetEntryPeriod | null,
    locationType: string | null,
    comment: string | null,
}

export class TimesheetEntry implements TimesheetEntryInterface {
    id: number;
    date: TimesheetDate;
    entryPeriod: TimesheetEntryPeriod | null;
    locationType: string | null;
    comment: string | null;

    constructor(timesheetEntryInput: TimesheetEntry | TimesheetEntryInterface) {
        this.id = timesheetEntryInput.id;
        this.date = timesheetEntryInput.date;
        this.entryPeriod = timesheetEntryInput.entryPeriod
        this.locationType = timesheetEntryInput.locationType;
        this.comment = timesheetEntryInput.comment
    }

    static createTimesheet(mobilizationDate: TimesheetDate, demobilizationDate: TimesheetDate): TimesheetEntry[] {
        let timesheet = [];
        const _mobDate = mobilizationDate;
        const _demobDate = demobilizationDate;
        const _firstDayOfTheMobilizationWeek = _mobDate.getFirstDayOfTheWeek;
        const _lastDayOfTheDemobilizationWeek = _demobDate.getLastDayOfTheWeek;
        let _cursorDate = new TimesheetDate(_firstDayOfTheMobilizationWeek);
        let count = 0;

        const defaultData = {
            startTime: '06:00',
            finishTime: '18:00',
            locationType: 'onshore',
            comment: 'Technical Support'
        }

        while (_cursorDate.isDateSameOrBefore(_lastDayOfTheDemobilizationWeek)) {
            count++;
            const currentDateIsWithinMobilizationPeriod: boolean = _cursorDate.isDateBetween(_mobDate, _demobDate);
            const startTime = currentDateIsWithinMobilizationPeriod ? defaultData.startTime : null;
            const finishTime = currentDateIsWithinMobilizationPeriod ? defaultData.finishTime : null

            let timesheetEntry = new TimesheetEntry({
                id: count,
                date: _cursorDate,
                entryPeriod: new TimesheetEntryPeriod({ startTime: startTime, finishTime: finishTime }),
                locationType: currentDateIsWithinMobilizationPeriod ? defaultData.locationType : null,
                comment: currentDateIsWithinMobilizationPeriod ? defaultData.locationType : null,
            });

            timesheet.push(timesheetEntry);
            _cursorDate = _cursorDate.dateIncrementByDay(1);
        }

        return timesheet;
    }
}

interface TimesheetInterface {
    meta: TimesheetMeta;
    entryCollection: TimesheetEntry[];
}

export class Timesheet implements TimesheetInterface {
    meta: TimesheetMeta;
    entryCollection: TimesheetEntry[];
    constructor(timesheetInput: TimesheetInterface | Timesheet) {
        this.meta = timesheetInput.meta;
        this.entryCollection = timesheetInput.entryCollection;
    }

    get timesheetEntryCollectionByWeek() {
        let flatTimesheetCollection = this.entryCollection;
        const groupedTimesheet = Object.groupBy(flatTimesheetCollection, ({ date }) => {
            return new TimesheetDate(date).weekNumber;
        });
        return groupedTimesheet;
    }

    get totalHours(): number {
        let hours = this.entryCollection.reduce((accumulator, timesheetEntry) => {
            if (timesheetEntry.entryPeriod != undefined) {
                let totalHourForCurrentEntry = timesheetEntry.entryPeriod.totalHours
                accumulator += totalHourForCurrentEntry
            }
            return accumulator
        }, 0);

        return hours;
    }

    get totalDays(): number {
        let totalDays = TimesheetDate.dayDifference(this.meta.mobilizationDate, this.meta.demobilizationDate) + 1;
        return totalDays;
    }
}


