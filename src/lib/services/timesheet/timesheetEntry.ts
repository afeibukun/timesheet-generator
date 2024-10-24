import { ErrorMessage, LocationType } from "@/lib/constants/constant";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { PlainTimesheetEntry, PlainTimesheetEntryType } from "@/lib/types/timesheet";
import { AppOptionSchema } from "@/lib/types/schema";
import { defaultTimesheetEntryData, defaultTimesheetEntryType } from "@/lib/constants/default";
import { getTimesheetEntryDefaultData } from "../indexedDB/indexedDBService";
import { TimesheetHour } from "./timesheetHour";
import { PrimitiveDefaultTimesheetEntry, PrimitiveTimesheetEntry, PrimitiveTimesheetEntryError } from "@/lib/types/primitive";

/**
 * Refers to actual timesheet activity entries, working time, travel time e.t.c.
 */
export class TimesheetEntry implements PlainTimesheetEntry {
    id: number;
    date: TimesheetDate;
    entryType: PlainTimesheetEntryType;
    entryPeriod: TimesheetEntryPeriod;
    locationType: LocationType;
    hasPremium: boolean;
    comment: string;

    constructor(timesheetEntryInput: PlainTimesheetEntry) {
        this.id = timesheetEntryInput.id!;
        this.date = new TimesheetDate(timesheetEntryInput.date);
        this.entryType = timesheetEntryInput.entryType
        this.entryPeriod = new TimesheetEntryPeriod(timesheetEntryInput.entryPeriod)
        this.locationType = timesheetEntryInput.locationType ? this.locationType = timesheetEntryInput.locationType : LocationType.onshore;
        this.hasPremium = timesheetEntryInput.hasPremium ? timesheetEntryInput.hasPremium : false;
        this.comment = timesheetEntryInput.comment ? timesheetEntryInput.comment : ''
    }

    get totalHours(): TimesheetHour {
        return new TimesheetEntryPeriod(this.entryPeriod!).totalHours
    }

    get totalHoursInString(): string {
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
        throw new Error(ErrorMessage.startTimeNotFound) // Time not found 
    }

    get entryPeriodFinishTime(): string {
        let time = this.entryPeriod?.finishTime?.time
        if (time) return time
        throw new Error(ErrorMessage.finishTimeNotFound) // finish time not found
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
        if (!this.isNullEntry && this.locationType == LocationType.onshore) return true
        return false
    }

    get isLocationTypeOffshore(): Boolean {
        if (!this.isNullEntry && this.locationType == LocationType.offshore) return true
        return false
    }

    get isCommentNull(): Boolean {
        if (this.isNullEntry || this.comment == null) return true
        return false
    }

    convertToPlain(): PlainTimesheetEntry {
        const _stringifiedTimesheetEntry = JSON.stringify(this)
        const _timesheetEntryAsInterface: PlainTimesheetEntry = JSON.parse(_stringifiedTimesheetEntry)
        return _timesheetEntryAsInterface;
    }

    convertToPrimitive(): PrimitiveTimesheetEntry {
        const _breakStartTime = this.entryPeriod?.breakTimeStart?.time;
        const _breakFinishTime = this?.entryPeriod?.breakTimeFinish?.time;

        if (!this.entryPeriod?.startTime) throw Error(ErrorMessage.invalidStartTime) // invalid starttime
        const _entryPeriodStartTime = this.entryPeriod.startTime.time

        if (!this.entryPeriod?.finishTime?.time) throw Error(ErrorMessage.invalidFinishTime)
        const _entryPeriodFinishTime = this.entryPeriod?.finishTime?.time

        const _primitiveTimesheetEntry: PrimitiveTimesheetEntry = { id: this.id, date: this.date.defaultFormat(), entryTypeSlug: this.entryType.slug, hasPremium: this.hasPremium, entryPeriodStartTime: _entryPeriodStartTime, entryPeriodFinishTime: _entryPeriodFinishTime, locationType: this.locationType, comment: this.comment, breakPeriodStartTime: _breakStartTime ? _breakStartTime : '', breakPeriodFinishTime: _breakFinishTime ? _breakFinishTime : '' }
        return _primitiveTimesheetEntry;
    }

    static async defaultInformation() {
        let defaultData: PrimitiveDefaultTimesheetEntry = defaultTimesheetEntryData
        try {
            const retrievedData: AppOptionSchema = await getTimesheetEntryDefaultData()
            if (retrievedData) {
                defaultData = retrievedData.value
            } else throw Error(ErrorMessage.defaultDataNotFound)
        } catch (e) { }

        return defaultData;
    }

    static convertPrimitiveToTimesheetEntry(primitiveTimesheetEntry: PrimitiveTimesheetEntry) {
        const _id = primitiveTimesheetEntry.id;
        const _date: TimesheetDate = new TimesheetDate(primitiveTimesheetEntry.date);
        const _entryType: PlainTimesheetEntryType = defaultTimesheetEntryType.filter((entryType) => entryType.slug == primitiveTimesheetEntry.entryTypeSlug)[0];

        const _entryPeriod: TimesheetEntryPeriod = TimesheetEntryPeriod.convertPrimitiveToEntryPeriod(primitiveTimesheetEntry.entryPeriodStartTime, primitiveTimesheetEntry.entryPeriodFinishTime, primitiveTimesheetEntry.breakPeriodStartTime, primitiveTimesheetEntry.breakPeriodFinishTime);

        const _locationType: LocationType = LocationType.offshore === primitiveTimesheetEntry.locationType ? LocationType.offshore : LocationType.onshore;
        const _hasPremium = !!primitiveTimesheetEntry.hasPremium
        const _comment = primitiveTimesheetEntry.comment
        const _timesheetEntry: TimesheetEntry = new TimesheetEntry({ id: _id, date: _date, entryType: _entryType, entryPeriod: _entryPeriod, locationType: _locationType, hasPremium: _hasPremium, comment: _comment });
        return _timesheetEntry;
    }

    static createId() {
        const randomCode = 273
        const id = randomCode.toString() + Date.now().toString();
        return Number(id);
    }

    static getTotalHoursInPrimitiveTimesheetEntry(primitiveTimesheetEntry: PrimitiveTimesheetEntry) {
        const _entry = TimesheetEntry.convertPrimitiveToTimesheetEntry(primitiveTimesheetEntry);
        return _entry.totalHoursInString;
    }

    /**
     * Timesheet Entry Rules
     * - entry type cannot be null
     * - location type should be either onshore or offshore
     * - hasPremium should be boolean
     * - start time should happen before finish time
     * - break time should be within start time and finish time.
     * - a 0 hr entry is invalid, and should not be saved at all
     */
}