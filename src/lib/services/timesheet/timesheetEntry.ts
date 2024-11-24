import { ErrorMessage, LocationType, OptionLabel } from "@/lib/constants/constant";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { PlainTimesheetEntry, PlainTimesheetEntryType, TimesheetEntryOption } from "@/lib/types/timesheet";
import { AppOptionSchema } from "@/lib/types/schema";
import { defaultTimesheetEntryData, defaultTimesheetEntryType } from "@/lib/constants/default";
import { getTimesheetEntryDefaultData } from "../indexedDB/indexedDBService";
import { TimesheetHour } from "./timesheetHour";
import { PlainDefaultTimesheetData, TimesheetEntryError } from "@/lib/types/primitive";
import { generateUniqueID, getRandomDigits } from "@/lib/helpers";

/**
 * Refers to actual timesheet activity entries, working time, travel time e.t.c.
 */
export class TimesheetEntry implements PlainTimesheetEntry {
    id: number | string;
    date: TimesheetDate;
    entryType: PlainTimesheetEntryType;
    entryPeriod: TimesheetEntryPeriod;
    locationType: LocationType;
    hasPremium: boolean;
    comment: string;
    options?: TimesheetEntryOption[];

    constructor(timesheetEntryInput: PlainTimesheetEntry) {
        this.id = timesheetEntryInput.id!;
        this.date = new TimesheetDate(timesheetEntryInput.date);
        this.entryType = timesheetEntryInput.entryType
        this.entryPeriod = new TimesheetEntryPeriod(timesheetEntryInput.entryPeriod)
        this.locationType = timesheetEntryInput.locationType ? this.locationType = timesheetEntryInput.locationType : LocationType.onshore;
        this.hasPremium = timesheetEntryInput.hasPremium ? timesheetEntryInput.hasPremium : false;
        this.comment = timesheetEntryInput.comment ? timesheetEntryInput.comment : ''
        this.options = timesheetEntryInput.options
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
        // throw new Error(ErrorMessage.startTimeNotFound) // Time not found 
        return ""
    }

    get entryPeriodFinishTime(): string {
        let time = this.entryPeriod?.finishTime?.time
        if (time) return time
        return ""
        // throw new Error(ErrorMessage.finishTimeNotFound) // finish time not found
    }

    get breakPeriodStartTime(): string {
        let time = this.entryPeriod?.breakTimeStart?.time
        if (time) return time
        return ""
    }

    get breakPeriodFinishTime(): string {
        let time = this.entryPeriod?.breakTimeFinish?.time
        if (time) return time
        return ""
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

    static async defaultInformation() {
        let defaultData: PlainDefaultTimesheetData = defaultTimesheetEntryData
        try {
            const retrievedData: AppOptionSchema = await getTimesheetEntryDefaultData()
            if (retrievedData) {
                defaultData = { ...defaultData, ...retrievedData.value }
            } else throw Error(ErrorMessage.defaultDataNotFound)
        } catch (e) { }

        return defaultData;
    }

    static createTimesheetEntryId() {
        const randomCode = 206
        const id = randomCode.toString() + generateUniqueID();
        return id;
    }

    static isExcludedFromReport(entry: TimesheetEntry, reportKey: string) {
        // options label: excludeFromReport, value: [customer, internal]        
        return entry.options ? entry.options.some((_option) => _option.key == OptionLabel.excludeEntryFromReport && Array.isArray(_option.value) && _option.value.includes(reportKey)) : false
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