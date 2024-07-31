import { LocalStorageLabel } from "@/lib/constants";
import { TimesheetDefaultInformation, TimesheetEntry } from "./timesheetEntry"
import { CannotParsePrimitiveDataToDefaultTimesheetInformationError, CannotParsePrimitiveDataToTimesheetError } from "./timesheetErrors";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetMeta, TimesheetMetaPrimitive } from "./timesheetMeta";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { Timesheet } from "./timesheet";

interface TimesheetLocalStorageInterface {

}

export class TimesheetLocalStorage implements TimesheetLocalStorageInterface {
    static setDefaultInformationInLocalStorage(timesheetDefaultInformation: TimesheetDefaultInformation) {
        localStorage.setItem(LocalStorageLabel.timesheetDefaultInformationLabel, JSON.stringify(timesheetDefaultInformation));
    }

    static getDefaultInformationFromLocalStorage(): TimesheetDefaultInformation {
        const rawDefaultTimesheetInformation = localStorage.getItem(LocalStorageLabel.timesheetDefaultInformationLabel);
        try {
            if (rawDefaultTimesheetInformation != null) {
                return JSON.parse(rawDefaultTimesheetInformation) as TimesheetDefaultInformation;
            }
        } catch (e) { }
        throw CannotParsePrimitiveDataToDefaultTimesheetInformationError;
    }

    static getPrimitiveTimesheetMetaFromLocalStorage(): TimesheetMetaPrimitive {
        const stringifiedTimesheetMeta = localStorage.getItem(LocalStorageLabel.currentTimesheetMetaLabel);
        if (stringifiedTimesheetMeta != null && stringifiedTimesheetMeta != undefined && stringifiedTimesheetMeta != '') {
            let primitiveTimesheetMeta = JSON.parse(stringifiedTimesheetMeta);
            return primitiveTimesheetMeta as TimesheetMetaPrimitive;
        }
        throw Error;
    }

    static setTimesheetMetaInLocalStorage(primitiveTimesheetMeta: TimesheetMetaPrimitive) {
        localStorage.setItem(LocalStorageLabel.currentTimesheetMetaLabel, JSON.stringify(primitiveTimesheetMeta));
    }


    static setGeneratedTimesheetInLocalStorage(timesheetEntryCollection: Timesheet) {
        localStorage.setItem(LocalStorageLabel.generatedTimesheetLabel, JSON.stringify(timesheetEntryCollection));
    }

    static getTimesheetFromLocalStorage(): Timesheet {
        const stringifiedTimesheetEntryCollection = localStorage.getItem(LocalStorageLabel.generatedTimesheetLabel);
        try {
            if (stringifiedTimesheetEntryCollection != null) {
                let primitiveTimesheet = JSON.parse(stringifiedTimesheetEntryCollection)

                let primitiveMeta = primitiveTimesheet.meta;
                let refreshedMobilizationDate = new TimesheetDate(primitiveMeta.mobilizationDate);
                let refreshedDemobilizationDate = new TimesheetDate(primitiveMeta.demobilizationDate);
                let refreshedMeta = new TimesheetMeta({ ...primitiveMeta, mobilizationDate: refreshedMobilizationDate, demobilizationDate: refreshedDemobilizationDate });

                let primitiveEntryCollection = primitiveTimesheet.entryCollection;
                let refreshedTimesheetEntryCollection = primitiveEntryCollection.map((primitiveEntry: any) => {
                    let refreshedDate = new TimesheetDate(primitiveEntry.date)
                    let refreshedEntryPeriod = new TimesheetEntryPeriod(primitiveEntry.entryPeriod);
                    return new TimesheetEntry({ ...primitiveEntry, date: refreshedDate, entryPeriod: refreshedEntryPeriod })
                })
                return new Timesheet({ meta: refreshedMeta, entryCollection: refreshedTimesheetEntryCollection });
            }
        } catch (e) { }
        throw new CannotParsePrimitiveDataToTimesheetError('cannot convert local storage data to timesheet data');
    }


}