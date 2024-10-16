
import { CannotParsePrimitiveDataToDefaultTimesheetInformationError } from "./timesheetErrors";
import { Timesheet } from "./timesheet";
import { PrimitiveDefaultTimesheetEntry } from "@/lib/types/primitive";
import { StorageLabel } from "@/lib/constants/storage";

export class TimesheetLocalStorage {
    static setDefaultInformationInLocalStorage(timesheetDefaultInformation: PrimitiveDefaultTimesheetEntry) {
        localStorage.setItem(StorageLabel.timesheetDefaultInformationLabel, JSON.stringify(timesheetDefaultInformation));
    }

    static getDefaultInformationFromLocalStorage(): PrimitiveDefaultTimesheetEntry {
        const rawDefaultTimesheetInformation = localStorage.getItem(StorageLabel.timesheetDefaultInformationLabel);
        try {
            if (rawDefaultTimesheetInformation != null) {
                return JSON.parse(rawDefaultTimesheetInformation) as PrimitiveDefaultTimesheetEntry;
            }
        } catch (e) { }
        throw new CannotParsePrimitiveDataToDefaultTimesheetInformationError('');
    }

    static setGeneratedTimesheetInLocalStorage(timesheetEntryCollection: Timesheet) {
        localStorage.setItem(StorageLabel.generatedTimesheetLabel, JSON.stringify(timesheetEntryCollection));
    }

    static clearTimesheetFromLocalStorage() {
        localStorage.removeItem(StorageLabel.currentTimesheetMetaLabel);
        localStorage.removeItem(StorageLabel.generatedTimesheetLabel);
        localStorage.removeItem(StorageLabel.timesheetDefaultInformationLabel);
    }
}