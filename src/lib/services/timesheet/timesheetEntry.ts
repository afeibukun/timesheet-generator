import { EntryStateConstants, } from "@/lib/constants";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { Timesheet, TimesheetDefaultInformation } from "./timesheet";

export type TimesheetEntryEditFormData = {
    id: number
    startTime: string,
    finishTime: string,
    locationType: string,
    comment: string,
    state: EntryStateConstants,
    updatedAt: TimesheetDate | null,
    isRecentlySaved: boolean
}

type EntryState = {
    entryId: number,
    state: EntryStateConstants
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

        let defaultData: TimesheetDefaultInformation = Timesheet.defaultInformation()

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
                comment: currentDateIsWithinMobilizationPeriod ? defaultData.comment : null,
            });

            timesheet.push(timesheetEntry);
            _cursorDate = _cursorDate.dateIncrementByDay(1);
        }

        return timesheet;
    }

    get isNullEntry(): boolean {
        if (this.entryPeriod == null || this.locationType == null || this.locationType == '') {
            return true
        }
        return false
    }
}

