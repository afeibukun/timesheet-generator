import { EntryStateEnum, LocationTypeEnum } from "@/lib/constants/enum";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { Timesheet } from "./timesheet";
import { DefaultPrimitiveTimesheetEntryDataInterface, TimesheetEntryInterface, TimesheetEntryTypeInterface } from "@/lib/types/timesheetType";

export class TimesheetEntry implements TimesheetEntryInterface {
    id: number;
    date: TimesheetDate;
    timesheetEntryType: TimesheetEntryTypeInterface;
    entryPeriod: TimesheetEntryPeriod;
    locationType?: LocationTypeEnum;
    comment?: string;

    constructor(timesheetEntryInput: TimesheetEntryInterface) {
        this.id = timesheetEntryInput.id;
        this.date = timesheetEntryInput.date;
        this.timesheetEntryType = timesheetEntryInput.timesheetEntryType
        this.entryPeriod = timesheetEntryInput.entryPeriod
        this.locationType = timesheetEntryInput.locationType;
        this.comment = timesheetEntryInput.comment
    }

    static createTimesheetEntryCollection(mobilizationDate: TimesheetDate, demobilizationDate: TimesheetDate): TimesheetEntry[] {
        let timesheet = [];
        let defaultData: DefaultPrimitiveTimesheetEntryDataInterface = Timesheet.defaultInformation()
        TimesheetDate.updateWeekStartDay(defaultData.weekStartDay);
        const _mobDate = mobilizationDate;
        const _demobDate = demobilizationDate;
        // const _firstDayOfTheMobilizationWeek = _mobDate.getFirstDayOfTheWeek;
        // const _lastDayOfTheDemobilizationWeek = _demobDate.getLastDayOfTheWeek;
        // let _cursorDate = new TimesheetDate(_firstDayOfTheMobilizationWeek);

        let _cursorDate = new TimesheetDate(_mobDate);
        let _count = 0;

        // while (_cursorDate.isDateSameOrBefore(_lastDayOfTheDemobilizationWeek)) {
        while (_cursorDate.isDateSameOrBefore(_demobDate)) {
            _count++;
            /* const _currentDateIsWithinMobilizationPeriod: boolean = _cursorDate.isDateBetween(_mobDate, _demobDate);
            const _startTime = _currentDateIsWithinMobilizationPeriod ? defaultData.startTime : null;
            const _finishTime = _currentDateIsWithinMobilizationPeriod ? defaultData.finishTime : null 
            const _locationType = _currentDateIsWithinMobilizationPeriod ? defaultData.locationType : null;
            const _comment = _currentDateIsWithinMobilizationPeriod ? defaultData.comment : null */

            const _startTime = defaultData.startTime;
            const _finishTime = defaultData.finishTime;
            const _locationType = defaultData.locationType as LocationTypeEnum;
            const _comment = defaultData.comment;
            const _timesheetEntryType = defaultData.timesheetEntryType

            let timesheetEntry = new TimesheetEntry({
                id: _count,
                date: _cursorDate,
                entryPeriod: new TimesheetEntryPeriod({ startTime: _startTime, finishTime: _finishTime }),
                locationType: _locationType,
                comment: _comment,
                timesheetEntryType: _timesheetEntryType
            });

            timesheet.push(timesheetEntry);
            _cursorDate = _cursorDate.dateIncrementByDay(1);
        }

        return timesheet;
    }

    get totalEntryPeriodHours(): number {
        return new TimesheetEntryPeriod(this.entryPeriod!).totalHours
    }

    get entryDateDayLabel(): string {
        let label = new TimesheetDate(this.date).dayLabel
        return label
    }

    get entryDateInDayMonthFormat(): string {
        let date = new TimesheetDate(this.date).dateInDayMonthFormat
        return date
    }
    get entryPeriodStartTime(): string {
        let time = this.entryPeriod?.startTime!
        return time
    }

    get entryPeriodFinishTime(): string {
        let time = this.entryPeriod?.finishTime!
        return time
    }

    get isNullEntry(): boolean {
        if (this.entryPeriod == null || this.locationType == null) {
            return true
        }
        return false
    }

    get isEntryPeriodStartTimeNull(): Boolean {
        if (this.isNullEntry || this.entryPeriod?.startTime == null) {
            return true
        }
        return false
    }

    get isEntryPeriodFinishTimeNull(): Boolean {
        if (this.isNullEntry || this.entryPeriod?.finishTime == null) {
            return true
        }
        return false
    }

    get isEntryPeriodValid(): Boolean {
        if (!this.isNullEntry && new TimesheetEntryPeriod(this.entryPeriod!).isValid) return true;
        return false
    }

    get isLocationTypeOnshore(): Boolean {
        if (!this.isNullEntry && this.locationType == LocationTypeEnum.onshore) return true
        return false
    }

    get isLocationTypeOffshore(): Boolean {
        if (!this.isNullEntry && this.locationType == LocationTypeEnum.offshore) return true
        return false
    }

    get isCommentNull(): Boolean {
        if (this.isNullEntry || this.comment == null) return true
        return false
    }
}

