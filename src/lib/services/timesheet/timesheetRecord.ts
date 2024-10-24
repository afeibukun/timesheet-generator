import { PlainTimesheetRecord, PlainTimesheetDate } from "@/lib/types/timesheet";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntry } from "./timesheetEntry";
import { TimesheetHour } from "./timesheetHour";
import { ErrorMessage, LocationType, TimesheetEntryType } from "@/lib/constants/constant";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { PrimitiveTimesheetEntry, PrimitiveTimesheetEntryError, PrimitiveTimesheetRecord } from "@/lib/types/primitive";

/**
 * Refers to a daily record of timesheet entries, it holds entries within the same day together
 */
export class TimesheetRecord implements PlainTimesheetRecord {
    id: number;
    date: TimesheetDate;
    entries: TimesheetEntry[];
    comment: string;

    constructor(timesheetRecordInput: PlainTimesheetRecord) {
        this.id = timesheetRecordInput.id!;
        this.date = new TimesheetDate(timesheetRecordInput.date);
        this.entries = timesheetRecordInput.entries.map((entry) => new TimesheetEntry(entry));
        this.comment = timesheetRecordInput.comment ? timesheetRecordInput.comment : ''
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

    convertToPrimitive(): PrimitiveTimesheetRecord {
        const _entries = this.entries.map((entry: TimesheetEntry) => {
            const _primitiveTimesheetEntry = entry.convertToPrimitive();
            return _primitiveTimesheetEntry
        });
        const _primitiveRecord: PrimitiveTimesheetRecord = { id: this.id, date: this.date.defaultFormat(), entries: _entries }
        return _primitiveRecord
    }

    convertToPlain() {
        const _plainEntries = this.entries.map((entry: TimesheetEntry) => {
            const _plainTimesheetEntry = entry.convertToPlain();
            return _plainTimesheetEntry
        });
        const _plainRecord: PlainTimesheetRecord = { id: this.id, date: this.date.convertToPlain(), entries: _plainEntries }
        return _plainRecord;
    }

    static convertPrimitiveToRecord(primitiveRecord: PrimitiveTimesheetRecord) {
        const _id = primitiveRecord.id;
        const _date: TimesheetDate = TimesheetDate.convertPrimitiveToDate(primitiveRecord.date);
        const _entries = primitiveRecord.entries.map((_primitiveEntry: PrimitiveTimesheetEntry) => {
            return TimesheetEntry.convertPrimitiveToTimesheetEntry(_primitiveEntry)
        })
        const _record: TimesheetRecord = new TimesheetRecord({ id: _id, date: _date, entries: _entries })
        return _record;
    }

    static createId() {
        const randomCode = 895
        const id = randomCode.toString() + Date.now().toString();
        return Number(id);
    }

    static monthNumberForPrimitiveRecord(primitiveRecord: PrimitiveTimesheetRecord) {
        const _record = TimesheetRecord.convertPrimitiveToRecord(primitiveRecord);
        return _record.monthNumber
    }

    static totalHoursForPrimitiveRecord(primitiveRecord: PrimitiveTimesheetRecord) {
        const _record = TimesheetRecord.convertPrimitiveToRecord(primitiveRecord);
        return _record.totalHoursInString
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

    static getEntriesWithOverlappingPeriodFromPrimitiveRecord(primitiveRecord: PrimitiveTimesheetRecord) {
        const _record = TimesheetRecord.convertPrimitiveToRecord(primitiveRecord);
        const _overlappingEntries = TimesheetRecord.getEntriesWithOverlappingPeriod(_record);
        return _overlappingEntries
    }

    static doesPrimitiveRecordHaveOverlappingTimeEntries(primitiveRecord: PrimitiveTimesheetRecord) {
        const _record = TimesheetRecord.convertPrimitiveToRecord(primitiveRecord);
        return TimesheetRecord.hasEntriesWithOverlappingPeriod(_record);
    }
    static entryTimeError = (primitiveEntry: PrimitiveTimesheetEntry, primitiveRecord: PrimitiveTimesheetRecord, timeType: "start" | "finish") => {
        const _entry = TimesheetEntry.convertPrimitiveToTimesheetEntry(primitiveEntry);
        let errorData = timeType === "start" ? TimesheetEntryPeriod.errorOnStartTime(_entry.entryPeriod) : TimesheetEntryPeriod.errorOnFinishTime(_entry.entryPeriod)
        if (errorData.error) return errorData

        if (_entry) {
            if (primitiveRecord) {
                const _doesPrimitiveRecordHaveOverlappingTimeEntries = TimesheetRecord.doesPrimitiveRecordHaveOverlappingTimeEntries(primitiveRecord)
                const _entriesWithOverlappingPeriod = TimesheetRecord.getEntriesWithOverlappingPeriodFromPrimitiveRecord(primitiveRecord)
                const _isEntryPartOfEntriesWithOverlappingPeriod = _entriesWithOverlappingPeriod.some(_overlappingEntry => _overlappingEntry.id === _entry.id)

                if (_doesPrimitiveRecordHaveOverlappingTimeEntries && _isEntryPartOfEntriesWithOverlappingPeriod) return { error: true, message: "Entry Period Overlaps with other entries." }
            }
        }
        return { error: false, message: "" }
    }


    static cheeckForErrorsInRecord = (primitiveRecord: PrimitiveTimesheetRecord, existingEntryErrors: PrimitiveTimesheetEntryError[]) => {
        const defaultErrorObject = { error: false, message: "" }
        let entryErrors: PrimitiveTimesheetEntryError[] = [];
        const _entryErrorsInRecord = primitiveRecord.entries.map((_primitiveEntry) => {
            let _entryTypeError = defaultErrorObject
            if (!_primitiveEntry.entryTypeSlug) _entryTypeError = { error: true, message: "Entry Type Not Selected" }

            let startTimeError = TimesheetRecord.entryTimeError(_primitiveEntry, primitiveRecord, 'start');
            let _entryStartTimeError = defaultErrorObject
            if (startTimeError.error) _entryStartTimeError = startTimeError

            let finishTimeError = TimesheetRecord.entryTimeError(_primitiveEntry, primitiveRecord, 'finish');
            let _entryFinishTimeError = defaultErrorObject
            if (finishTimeError.error) _entryFinishTimeError = finishTimeError

            const _entry = TimesheetEntry.convertPrimitiveToTimesheetEntry(_primitiveEntry)
            let breakStartTimeError = TimesheetEntryPeriod.errorOnBreakStartTime(_entry.entryPeriod);
            let _entryBreakStartTimeError = defaultErrorObject
            if (breakStartTimeError.error) _entryBreakStartTimeError = breakStartTimeError

            let breakFinishTimeError = TimesheetEntryPeriod.errorOnBreakFinishTime(_entry.entryPeriod);
            let _entryBreakFinishTimeError = defaultErrorObject
            if (breakFinishTimeError.error) _entryBreakFinishTimeError = breakFinishTimeError

            let entryError: PrimitiveTimesheetEntryError = existingEntryErrors.filter((e) => e.id === _primitiveEntry.id)[0];

            if (entryError) entryError = { ...entryError, entryType: _entryTypeError, entryPeriodStartTime: _entryStartTimeError, entryPeriodFinishTime: _entryFinishTimeError, breakPeriodStartTime: _entryBreakStartTimeError, breakPeriodFinishTime: _entryBreakFinishTimeError }
            else entryError = { id: _primitiveEntry.id, entryType: _entryTypeError, entryPeriodStartTime: _entryStartTimeError, entryPeriodFinishTime: _entryFinishTimeError, breakPeriodStartTime: _entryBreakStartTimeError, breakPeriodFinishTime: _entryBreakFinishTimeError, locationType: defaultErrorObject }
            return entryError
        })
        entryErrors = [...entryErrors, ..._entryErrorsInRecord]
        return entryErrors
    }

    /**
     * Timesheet Record Rules
     * - entries within a timesheet record should not have times that overlap. rather they can be sequential
     * - if one entry has premium, every other entry within record would have premium.
     * - if a record does not have an entry, it is considered as though it doesn't exist.
     */
}