import { EntryStateEnum, LocationTypeEnum } from "@/lib/constants/enum";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { Timesheet } from "./timesheet";
import { DefaultPrimitiveTimesheetEntryDataInterface, PrimitiveTimesheetEntryInterface, TimesheetDateInterface, TimesheetEntryInterface, TimesheetEntryPeriodInterface, TimesheetEntryTypeInterface } from "@/lib/types/timesheetType";
import { AppOptionSchema } from "@/lib/constants/schema";
import { defaultTimesheetEntryData, defaultTimesheetEntryType } from "@/lib/constants/defaultData";
import { getTimesheetEntryDefaultData } from "../indexedDB/indexedDBService";
import { TimesheetHour } from "./timesheetHour";

export class TimesheetEntry implements TimesheetEntryInterface {
    id: number;
    date: TimesheetDate;
    entryType: TimesheetEntryTypeInterface;
    entryPeriod: TimesheetEntryPeriod;
    locationType: LocationTypeEnum;
    hasPremium: boolean;
    comment: string;

    constructor(timesheetEntryInput: TimesheetEntryInterface) {
        this.id = timesheetEntryInput.id!;
        this.date = new TimesheetDate(timesheetEntryInput.date);
        this.entryType = timesheetEntryInput.entryType
        this.entryPeriod = new TimesheetEntryPeriod(timesheetEntryInput.entryPeriod)
        this.locationType = timesheetEntryInput.locationType ? this.locationType = timesheetEntryInput.locationType : LocationTypeEnum.onshore;
        this.hasPremium = timesheetEntryInput.hasPremium ? timesheetEntryInput.hasPremium : false;
        this.comment = timesheetEntryInput.comment ? timesheetEntryInput.comment : ''
    }

    get totalEntryPeriodHours(): TimesheetHour {
        return new TimesheetEntryPeriod(this.entryPeriod!).totalHours
    }

    get totalEntryPeriodHoursInString(): string {
        return new TimesheetEntryPeriod(this.entryPeriod!).totalHoursInString
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
        let time = this.entryPeriod?.startTime?.time
        if (time) return time
        throw new Error // Time not found 
    }

    get entryPeriodFinishTime(): string {
        let time = this.entryPeriod?.finishTime?.time
        if (time) return time
        throw new Error // finish time not found
    }

    get weekNumber(): number {
        const timesheetEntryWeek = this.date.weekNumber;
        return timesheetEntryWeek;
    }

    get monthNumber(): number {
        return this.date.monthNumber;
    }

    get month(): string {
        return this.date.month;
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

    static async defaultInformation() {
        let defaultData: DefaultPrimitiveTimesheetEntryDataInterface = defaultTimesheetEntryData
        try {
            const retrievedData: AppOptionSchema = await getTimesheetEntryDefaultData()
            if (retrievedData) {
                defaultData = retrievedData.value
            } else throw Error
        } catch (e) { }

        return defaultData;
    }

    static getTimesheetEntryForDate(timesheet: Timesheet, day: TimesheetDate) {
        const timesheetEntryCollection = timesheet.entries.filter((entry) => day.isEqual(entry.date))
        return timesheetEntryCollection;
    }

    static convertPrimitiveToTimesheetEntryInterface(primitiveTimesheetEntry: PrimitiveTimesheetEntryInterface) {
        const _id = primitiveTimesheetEntry.id;
        const _date: TimesheetDateInterface = { date: primitiveTimesheetEntry.date };
        const _entryType: TimesheetEntryTypeInterface = defaultTimesheetEntryType.filter((entryType) => entryType.slug == primitiveTimesheetEntry.entryTypeSlug)[0];

        let _breakTimeStart = !!primitiveTimesheetEntry.breakPeriodStartTime ? new TimesheetHour(primitiveTimesheetEntry.breakPeriodStartTime) : undefined;
        let _breakTimeFinish = !!primitiveTimesheetEntry.breakPeriodFinishTime ? new TimesheetHour(primitiveTimesheetEntry.breakPeriodFinishTime) : undefined;
        if (!_breakTimeStart || !_breakTimeFinish) {
            _breakTimeStart = undefined
            _breakTimeFinish = undefined
        }

        const _entryPeriod: TimesheetEntryPeriodInterface = { startTime: new TimesheetHour(primitiveTimesheetEntry.entryPeriodStartTime), finishTime: new TimesheetHour(primitiveTimesheetEntry.entryPeriodFinishTime), breakTimeStart: _breakTimeStart, breakTimeFinish: _breakTimeFinish }
        const _locationType: LocationTypeEnum = LocationTypeEnum.offshore === primitiveTimesheetEntry.locationType ? LocationTypeEnum.offshore : LocationTypeEnum.onshore;
        const _hasPremium = !!primitiveTimesheetEntry.hasPremium
        const _comment = primitiveTimesheetEntry.comment
        const _timesheetEntry: TimesheetEntryInterface = { id: _id, date: _date, entryType: _entryType, entryPeriod: _entryPeriod, locationType: _locationType, hasPremium: _hasPremium, comment: _comment };
        return _timesheetEntry;
    }
}

