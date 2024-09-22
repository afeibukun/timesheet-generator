import { LocalStorageLabelEnum } from "@/lib/constants/enum";
import { TimesheetEntry } from "../timesheet/timesheetEntry";
import { CannotParsePrimitiveDataToDefaultTimesheetInformationError, CannotParsePrimitiveDataToTimesheetError } from "../timesheet/timesheetErrors";
import { TimesheetDate } from "../timesheet/timesheetDate";
import { TimesheetMeta } from "../timesheet/timesheetMeta";
import { TimesheetEntryPeriod } from "../timesheet/timesheetEntryPeriod";
import { Timesheet } from "../timesheet/timesheet";
import { DefaultPrimitiveTimesheetEntryDataInterface, PrimitiveTimesheetMetaInterface } from "@/lib/types/timesheetType";

export class TimesheetLocalStorage {
    static setDefaultInformationInLocalStorage(timesheetDefaultInformation: DefaultPrimitiveTimesheetEntryDataInterface) {
        localStorage.setItem(LocalStorageLabelEnum.timesheetDefaultInformationLabel, JSON.stringify(timesheetDefaultInformation));
    }

    static getDefaultInformationFromLocalStorage(): DefaultPrimitiveTimesheetEntryDataInterface {
        const rawDefaultTimesheetInformation = localStorage.getItem(LocalStorageLabelEnum.timesheetDefaultInformationLabel);
        try {
            if (rawDefaultTimesheetInformation != null) {
                return JSON.parse(rawDefaultTimesheetInformation) as DefaultPrimitiveTimesheetEntryDataInterface;
            }
        } catch (e) { }
        throw new CannotParsePrimitiveDataToDefaultTimesheetInformationError('');
    }

    static getPrimitiveTimesheetMetaFromLocalStorage(): PrimitiveTimesheetMetaInterface {
        const stringifiedTimesheetMeta = localStorage.getItem(LocalStorageLabelEnum.currentTimesheetMetaLabel);
        if (stringifiedTimesheetMeta != null && stringifiedTimesheetMeta != undefined && stringifiedTimesheetMeta != '') {
            let primitiveTimesheetMeta = JSON.parse(stringifiedTimesheetMeta);
            return primitiveTimesheetMeta as PrimitiveTimesheetMetaInterface;
        }
        throw Error;
    }

    static setTimesheetMetaInLocalStorage(primitiveTimesheetMeta: PrimitiveTimesheetMetaInterface) {
        localStorage.setItem(LocalStorageLabelEnum.currentTimesheetMetaLabel, JSON.stringify(primitiveTimesheetMeta));
    }


    static setGeneratedTimesheetInLocalStorage(timesheetEntryCollection: Timesheet) {
        localStorage.setItem(LocalStorageLabelEnum.generatedTimesheetLabel, JSON.stringify(timesheetEntryCollection));
    }

    static getTimesheetFromLocalStorage(): Timesheet {
        const stringifiedTimesheetEntryCollection = localStorage.getItem(LocalStorageLabelEnum.generatedTimesheetLabel);
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

    static clearTimesheetFromLocalStorage() {
        localStorage.removeItem(LocalStorageLabelEnum.currentTimesheetMetaLabel);
        localStorage.removeItem(LocalStorageLabelEnum.generatedTimesheetLabel);
        localStorage.removeItem(LocalStorageLabelEnum.timesheetDefaultInformationLabel);
    }
}