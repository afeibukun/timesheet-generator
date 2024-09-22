import { defaultTimesheetEntryData } from "@/lib/constants/defaultData";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntry } from "./timesheetEntry";
import { TimesheetMeta } from "./timesheetMeta";
import { TimesheetLocalStorage } from "./timesheetLocalStorage";
import { DefaultPrimitiveTimesheetEntryDataInterface, TimesheetInterface } from "@/lib/types/timesheetType";

export class Timesheet implements TimesheetInterface {

    meta: TimesheetMeta;
    entryCollection: TimesheetEntry[];

    constructor(timesheetInput: TimesheetInterface) {
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

    static isNull(timesheet: Timesheet | null): Boolean {
        if (timesheet == null || timesheet == undefined || !('entryCollection' in timesheet) || !('meta' in timesheet)) return true;
        return false;
    }

    static defaultInformation(): DefaultPrimitiveTimesheetEntryDataInterface {
        let defaultData: DefaultPrimitiveTimesheetEntryDataInterface = defaultTimesheetEntryData
        try {
            let retrievedDefaultInfo = TimesheetLocalStorage.getDefaultInformationFromLocalStorage();
            defaultData = retrievedDefaultInfo;
        } catch (e) { }
        return defaultData;
    }

    static hasUpdatedDefaultInformation(): Boolean {
        let defaultData = Timesheet.defaultInformation();
        if (defaultData.updatedAt == '' || defaultData.updatedAt == undefined || defaultData.updatedAt == null) return false;
        return true
    }
}

