import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntry } from "./timesheetEntry";
import { TimesheetMeta } from "./timesheetMeta";

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

