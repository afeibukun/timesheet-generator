
import { CannotParsePrimitiveDataToDefaultTimesheetInformationError } from "./timesheetErrors";
import { Timesheet } from "./timesheet";
import { StorageLabel } from "@/lib/constants/storage";
import { PlainDefaultTimesheetData } from "@/lib/types/timesheet";

export class TimesheetLocalStorage {
    static setDefaultInformationInLocalStorage(timesheetDefaultInformation: PlainDefaultTimesheetData) {
        localStorage.setItem(StorageLabel.timesheetDefaultInformationLabel, JSON.stringify(timesheetDefaultInformation));
    }

    static getDefaultInformationFromLocalStorage(): PlainDefaultTimesheetData {
        const rawDefaultTimesheetInformation = localStorage.getItem(StorageLabel.timesheetDefaultInformationLabel);
        try {
            if (rawDefaultTimesheetInformation != null) {
                return JSON.parse(rawDefaultTimesheetInformation) as PlainDefaultTimesheetData;
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