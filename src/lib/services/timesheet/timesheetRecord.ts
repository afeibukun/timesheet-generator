import { PlainTimesheetRecord, PlainTimesheetDate, TimesheetRecordOption, TimesheetEntryError } from "@/lib/types/timesheet";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntry } from "./timesheetEntry";
import { TimesheetHour } from "./timesheetHour";
import { ErrorMessage, LocationType, OptionLabel, TimesheetEntryType, } from "@/lib/constants/constant";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { generateUniqueID } from "@/lib/helpers";
import { Customer } from "../meta/customer";
import { Site } from "../meta/site";
import { Project } from "../meta/project";

/**
 * Refers to a daily record of timesheet entries, it holds entries within the same day together
 */
export class TimesheetRecord implements PlainTimesheetRecord {
    id?: number;
    key: number | string;
    date: TimesheetDate;
    entries: TimesheetEntry[];
    customer: Customer;
    project: Project;
    comment: string;
    options?: TimesheetRecordOption[]

    constructor(plainRecord: PlainTimesheetRecord) {

        if (!plainRecord.customer.activeSite) throw new Error("Invalid Timesheet Record", { cause: "Active site not set for the customer" })

        this.id = plainRecord.id;
        this.key = plainRecord.key;
        this.date = new TimesheetDate(plainRecord.date);
        this.entries = plainRecord.entries.map((entry) => new TimesheetEntry(entry));
        this.customer = new Customer(plainRecord.customer) // should have an active site
        this.project = new Project(plainRecord.project)
        this.comment = plainRecord.comment ? plainRecord.comment : '';
        this.options = plainRecord.options
    }

    /**
     * @property totalHours
     * @description computes Total Recorded hours for a day 
     * @returns TimesheetHour
     */
    get totalHours(): TimesheetHour {
        let hours = this.entries.reduce((accumulator, timesheetEntry) => {
            accumulator = TimesheetHour.sumTimesheetHours(timesheetEntry.totalHours, accumulator)
            return accumulator
        }, new TimesheetHour("00:00"));
        return hours;
    }

    /**
     * @property totalHoursInString
     * @description computes Total Recorded hours for a day 
     * @returns string
     */
    get totalHoursInString(): string {
        return this.totalHours.time
    }

    get hasHours() {
        return !(this.totalHours.hour === 0 && this.totalHours.minute === 0)
    }

    get dayLabel(): string {
        let label = new TimesheetDate(this.date).dayLabel
        return label
    }

    get dateInDayMonthFormat(): string {
        let date = new TimesheetDate(this.date).dateInDayMonthFormat
        return date
    }

    get weekNumber(): number {
        const _timesheetRecordWeek = this.date.weekNumber;
        return _timesheetRecordWeek;
    }

    get monthNumber(): number {
        return this.date.monthNumber;
    }

    get yearNumber(): number {
        return this.date.yearNumber;
    }

    get month(): string {
        return this.date.month;
    }

    get isNull(): boolean {
        return (this.entries.length == 0 || this.entries == undefined)
    }

    get locationType(): LocationType {
        // I think all entries inside a particular record should have the same location type, so for now, I will assume the location type of the first entry as the location type for the rest
        // TODO: Move the location type variable into record - or think am well again
        return this.entries[0].locationType;
    }

    get isLocationTypeOnshore(): Boolean {
        if (this.locationType == LocationType.onshore) return true
        return false
    }

    get isLocationTypeOffshore(): Boolean {
        if (this.locationType == LocationType.offshore) return true
        return false
    }

    get consolidatedComment() {
        if (!!this.comment) return this.comment
        const _comment = this.entries.reduce((accumulator, _currentValue) => {

            return `${accumulator} ${accumulator !== '' ? ',' : ''} ${_currentValue.comment}`
        }, '')
        // return this.entries[0].comment;
        return _comment;
    }

    hasEntry(): Boolean {
        return this.entries.some((entry) => this.date.isEqual(entry.date))
    }

    convertToPlain() {
        const _plainEntries = this.entries.map((entry: TimesheetEntry) => {
            const _plainTimesheetEntry = entry.convertToPlain();
            return _plainTimesheetEntry
        });
        const _plainRecord: PlainTimesheetRecord = { id: this.id, key: this.key, date: this.date.convertToPlain(), entries: _plainEntries, customer: this.customer.convertToPlain(), project: this.project.convertToPlain() }
        return _plainRecord;
    }

    static createTimesheetRecordId(date?: TimesheetDate, index?: number) {
        const dayInMonth = date ? date.dayInMonth : 0
        let _index = index ?? 0
        const randomCode = 167 + dayInMonth + _index
        const id = randomCode + '' + generateUniqueID();
        return id;
    }

    static getEntriesWithOverlappingPeriod(record: TimesheetRecord) {
        if (!record.hasEntry()) throw Error(ErrorMessage.entryOnDateNotFound);
        const _entriesInDay = record.entries;
        let _cursorEntries = [..._entriesInDay];
        let _overlappingEntries: TimesheetEntry[] = [];
        let _countMain = _cursorEntries.length - 1;
        let _countSub = 0;
        while (_countMain !== 0) {
            const overlapChecker = TimesheetEntryPeriod.doesPeriodOverlap(_cursorEntries[_countMain].entryPeriod, _cursorEntries[_countSub].entryPeriod)
            if (overlapChecker) {
                _overlappingEntries = [..._overlappingEntries, _cursorEntries[_countMain], _cursorEntries[_countSub]]
            }
            _countSub++
            if (_countSub >= _cursorEntries.length - 1) {
                _cursorEntries.pop();
                _countSub = 0;
                _countMain = _cursorEntries.length - 1;
            }
        }
        return _overlappingEntries
    }

    static hasEntriesWithOverlappingPeriod(record: TimesheetRecord) {
        if (!record.hasEntry()) throw Error(ErrorMessage.entryOnDateNotFound);
        const _entriesInDay = record.entries;
        let _cursorEntries = [..._entriesInDay];
        let _countMain = _cursorEntries.length - 1;
        let _countSub = 0;
        let _hasOverlap = false;
        while (_countMain !== 0 && !_hasOverlap) {
            _hasOverlap = TimesheetEntryPeriod.doesPeriodOverlap(_cursorEntries[_countMain].entryPeriod, _cursorEntries[_countSub].entryPeriod)
            _countSub++
            if (_countSub >= _cursorEntries.length - 1) {
                _cursorEntries.pop();
                _countSub = 0;
                _countMain = _cursorEntries.length - 1;
            }
        }
        return _hasOverlap
    }

    static entryTimeError = (entry: TimesheetEntry, record: TimesheetRecord, timeType: "start" | "finish") => {
        let errorData = timeType === "start" ? TimesheetEntryPeriod.errorOnStartTime(entry.entryPeriod) : TimesheetEntryPeriod.errorOnFinishTime(entry.entryPeriod)
        if (errorData.error) return errorData

        if (entry) {
            if (record) {
                const _doesRecordHaveOverlappingTimeEntries = TimesheetRecord.hasEntriesWithOverlappingPeriod(record)
                const _entriesWithOverlappingPeriod = TimesheetRecord.getEntriesWithOverlappingPeriod(record)
                const _isEntryPartOfEntriesWithOverlappingPeriod = _entriesWithOverlappingPeriod.some(_overlappingEntry => _overlappingEntry.id === entry.id)

                if (_doesRecordHaveOverlappingTimeEntries && _isEntryPartOfEntriesWithOverlappingPeriod) return { error: true, message: "Entry Period Overlaps with other entries." }
            }
        }
        return { error: false, message: "" }
    }

    static cheeckForErrorsInRecord = (record: TimesheetRecord, existingEntryErrors: TimesheetEntryError[]) => {
        const defaultErrorObject = { error: false, message: "" }
        let entryErrors: TimesheetEntryError[] = [];
        const _entryErrorsInRecord = record.entries.map((_entry) => {
            let _entryTypeError = defaultErrorObject
            if (!_entry.entryType.slug) _entryTypeError = { error: true, message: "Entry Type Not Selected" }

            let startTimeError = TimesheetRecord.entryTimeError(_entry, record, 'start');
            let _entryStartTimeError = defaultErrorObject
            if (startTimeError.error) _entryStartTimeError = startTimeError

            let finishTimeError = TimesheetRecord.entryTimeError(_entry, record, 'finish');
            let _entryFinishTimeError = defaultErrorObject
            if (finishTimeError.error) _entryFinishTimeError = finishTimeError

            let breakStartTimeError = TimesheetEntryPeriod.errorOnBreakStartTime(_entry.entryPeriod);
            let _entryBreakStartTimeError = defaultErrorObject
            if (breakStartTimeError.error) _entryBreakStartTimeError = breakStartTimeError

            let breakFinishTimeError = TimesheetEntryPeriod.errorOnBreakFinishTime(_entry.entryPeriod);
            let _entryBreakFinishTimeError = defaultErrorObject
            if (breakFinishTimeError.error) _entryBreakFinishTimeError = breakFinishTimeError

            let entryError: TimesheetEntryError = existingEntryErrors.filter((e) => e.id === _entry.id)[0];

            if (entryError) entryError = { ...entryError, entryType: _entryTypeError, entryPeriodStartTime: _entryStartTimeError, entryPeriodFinishTime: _entryFinishTimeError, breakPeriodStartTime: _entryBreakStartTimeError, breakPeriodFinishTime: _entryBreakFinishTimeError }
            else entryError = { id: _entry.id, entryType: _entryTypeError, entryPeriodStartTime: _entryStartTimeError, entryPeriodFinishTime: _entryFinishTimeError, breakPeriodStartTime: _entryBreakStartTimeError, breakPeriodFinishTime: _entryBreakFinishTimeError, locationType: defaultErrorObject }
            return entryError
        })
        entryErrors = [...entryErrors, ..._entryErrorsInRecord]
        return entryErrors
    }

    static hasPremium = (record: TimesheetRecord) => {
        return record.entries.some((_entry) => _entry.hasPremium)
    }

    static hasPublicHoliday = (record: TimesheetRecord) => {
        const recordHasPublicHolidayOption = record.options ? record.options.some((_option) => _option.key == OptionLabel.isPublicHoliday) : false
        if (recordHasPublicHolidayOption) return !!(record?.options?.find((_option) => _option.key == OptionLabel.isPublicHoliday)?.value)
        return false
    }

    /**
     * Timesheet Record Rules
     * - entries within a timesheet record should not have times that overlap. rather they can be sequential
     * - if one entry has premium, every other entry within record would have premium.
     * - if a record does not have an entry, it is considered as though it doesn't exist.
     */
}