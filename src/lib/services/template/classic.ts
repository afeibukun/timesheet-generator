import { TimesheetEntryType } from "@/lib/constants/constant"
import { TimesheetRecord } from "../timesheet/timesheetRecord"

export class ClassicTemplate {
    static workingPeriods(timesheetRecord: TimesheetRecord) {
        const _workingTimeList = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.workingTime).map((_workingTimeEntry) => {
            return { startTime: _workingTimeEntry.entryPeriodStartTime, finishTime: _workingTimeEntry.entryPeriodFinishTime }
        })
        return _workingTimeList;
    }

    static workingPeriod1(timesheetRecord: TimesheetRecord) {
        const index = 0
        const _workingEntry = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.workingTime)[index];
        return { startTime: _workingEntry.entryPeriodStartTime, finishTime: _workingEntry.entryPeriodFinishTime }
    }

    static hasWorkingPeriod1(timesheetRecord: TimesheetRecord) {
        try {
            return !!ClassicTemplate.workingPeriod1(timesheetRecord).startTime && !!ClassicTemplate.workingPeriod1(timesheetRecord).finishTime
        } catch (e) { }
        return false
    }

    static workingPeriod2(timesheetRecord: TimesheetRecord) {
        const index = 1
        const _workingEntry = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.workingTime)[index];
        return { startTime: _workingEntry.entryPeriodStartTime, finishTime: _workingEntry.entryPeriodFinishTime }
    }

    static hasWorkingPeriod2(timesheetRecord: TimesheetRecord) {
        try {
            return !!ClassicTemplate.workingPeriod2(timesheetRecord).startTime && !!ClassicTemplate.workingPeriod2(timesheetRecord).finishTime
        } catch (e) { }
        return false
    }

    static workingPeriod3(timesheetRecord: TimesheetRecord) {
        const index = 2
        const _workingEntry = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.workingTime)[index];
        return { startTime: _workingEntry.entryPeriodStartTime, finishTime: _workingEntry.entryPeriodFinishTime }
    }

    static hasWorkingPeriod3(timesheetRecord: TimesheetRecord) {
        try {
            return !!ClassicTemplate.workingPeriod3(timesheetRecord).startTime && !!ClassicTemplate.workingPeriod3(timesheetRecord).finishTime
        } catch (e) { }
        return false
    }

    static workingPeriod4(timesheetRecord: TimesheetRecord) {
        const index = 3
        const _workingEntry = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.workingTime)[index];
        return { startTime: _workingEntry.entryPeriodStartTime, finishTime: _workingEntry.entryPeriodFinishTime }
    }

    static hasWorkingPeriod4(timesheetRecord: TimesheetRecord) {
        try {
            return !!ClassicTemplate.workingPeriod4(timesheetRecord).startTime && !!ClassicTemplate.workingPeriod4(timesheetRecord).finishTime
        } catch (e) { }
        return false
    }

    static waitingPeriods(timesheetRecord: TimesheetRecord) {
        const _waitingTimeList = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.waitingTime).map((_waitingTimeEntry) => {
            return { startTime: _waitingTimeEntry.entryPeriodStartTime, finishTime: _waitingTimeEntry.entryPeriodFinishTime }
        })
        return _waitingTimeList;
    }

    static waitingPeriod1(timesheetRecord: TimesheetRecord) {
        const index = 0
        const _waitingEntry = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.waitingTime)[index];
        return { startTime: _waitingEntry.entryPeriodStartTime, finishTime: _waitingEntry.entryPeriodFinishTime }
    }

    static hasWaitingPeriod1(timesheetRecord: TimesheetRecord) {
        try {
            return !!ClassicTemplate.waitingPeriod1(timesheetRecord).startTime && !!ClassicTemplate.waitingPeriod1(timesheetRecord).finishTime
        } catch (e) { }
        return false
    }

    static waitingPeriod2(timesheetRecord: TimesheetRecord) {
        const index = 1
        const _waitingEntry = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.workingTime)[index];
        return { startTime: _waitingEntry.entryPeriodStartTime, finishTime: _waitingEntry.entryPeriodFinishTime }
    }

    static hasWaitingPeriod2(timesheetRecord: TimesheetRecord) {
        try {
            return !!ClassicTemplate.waitingPeriod2(timesheetRecord).startTime && !!ClassicTemplate.waitingPeriod2(timesheetRecord).finishTime
        } catch (e) { }
        return false
    }

    static travelPeriods(timesheetRecord: TimesheetRecord) {
        const _waitingTimeList = timesheetRecord.entries.filter((_entry) => (_entry.entryType.slug === TimesheetEntryType.travelTimeToSite || _entry.entryType.slug === TimesheetEntryType.travelTimeFromSite || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization)).map((_travelTimeEntry) => {
            return { startTime: _travelTimeEntry.entryPeriodStartTime, finishTime: _travelTimeEntry.entryPeriodFinishTime }
        })
        return _waitingTimeList;
    }

    static travelPeriod1(timesheetRecord: TimesheetRecord) {
        const index = 0
        const _travelEntry = timesheetRecord.entries.filter((_entry) => (_entry.entryType.slug === TimesheetEntryType.travelTimeToSite || _entry.entryType.slug === TimesheetEntryType.travelTimeFromSite || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization))[index];
        return { startTime: _travelEntry.entryPeriodStartTime, finishTime: _travelEntry.entryPeriodFinishTime }
    }

    static hasTravelPeriod1(timesheetRecord: TimesheetRecord) {
        try {
            return !!ClassicTemplate.travelPeriod1(timesheetRecord).startTime && !!ClassicTemplate.travelPeriod1(timesheetRecord).finishTime
        } catch (e) { }
        return false
    }

    static travelPeriod2(timesheetRecord: TimesheetRecord) {
        const index = 1
        const _travelEntry = timesheetRecord.entries.filter((_entry) => (_entry.entryType.slug === TimesheetEntryType.travelTimeToSite || _entry.entryType.slug === TimesheetEntryType.travelTimeFromSite || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization))[index];
        return { startTime: _travelEntry.entryPeriodStartTime, finishTime: _travelEntry.entryPeriodFinishTime }
    }

    static hasTravelPeriod2(timesheetRecord: TimesheetRecord) {
        try {
            return !!ClassicTemplate.travelPeriod2(timesheetRecord).startTime && !!ClassicTemplate.travelPeriod2(timesheetRecord).finishTime
        } catch (e) { }
        return false
    }

    /**
     * Notes on the Working Time, Waiting Time and Travel Time
     * I could adapt this structure to be a rule on the timesheet.
     * We can only have 4 working time entries for a single day, 2 waiting time entries and 2 travel time entries,
     * sounds more than enough though, I can't imagine a scenario where someone will book more than that.
     * Now thinking on this, this is not a real limitation  that should be kept on the timesheet record class. I think it is unique to a particular template.
     * Thus I should move it there
     */

    static generateFilename(templateConfig: any, timesheetStartMonth: number, timesheetStartYear: number, personnelName: string) {
        const fileNameSuffix = templateConfig.fileNameSuffix == undefined || templateConfig.fileNameSuffix == null || templateConfig.fileNameSuffix == '' || !templateConfig.fileNameSuffix ? '' : `-${templateConfig.fileNameSuffix}`
        const timesheetFileName = `${timesheetStartMonth.toString().padStart(2, "0")}-${timesheetStartYear}-Customer_Timesheet-${personnelName}${fileNameSuffix}`;
        return timesheetFileName
    }

}