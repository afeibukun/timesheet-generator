import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";

interface TimesheetEntryInterface {
    id: number,
    date: TimesheetDate,
    entryPeriod: TimesheetEntryPeriod,
    locationType: string,
    comment: string,
}

export class TimesheetEntry implements TimesheetEntryInterface {
    id: number;
    date: TimesheetDate;
    entryPeriod: TimesheetEntryPeriod;
    locationType: string;
    comment: string;

    constructor({ id, date, startTime, finishTime, locationType, comment }: any) {
        this.id = id;
        this.date = date;
        this.entryPeriod = new TimesheetEntryPeriod(startTime, finishTime);
        this.locationType = locationType;
        this.comment = comment
    }

    static createTimesheet(mobilizationDate: TimesheetDate, demobilizationDate: TimesheetDate): TimesheetEntry[] {
        let timesheet = [];
        const _mobDate = mobilizationDate;
        const _demobDate = demobilizationDate;
        const _firstDayOfTheMobilizationWeek = _mobDate.getFirstDayOfTheWeek();
        const _lastDayOfTheDemobilizationWeek = _demobDate.getLastDayOfTheWeek();
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
            let timesheetEntry = new TimesheetEntry({
                id: count,
                date: _cursorDate,
                startTime: currentDateIsWithinMobilizationPeriod ? defaultData.startTime : null,
                finishTime: currentDateIsWithinMobilizationPeriod ? defaultData.finishTime : null,
                locationType: currentDateIsWithinMobilizationPeriod ? defaultData.locationType : null,
                comment: currentDateIsWithinMobilizationPeriod ? defaultData.locationType : null,
            });
            timesheet.push(timesheetEntry);
            _cursorDate.dateIncrementByDay(1);
        }

        return timesheet;
    }
}


