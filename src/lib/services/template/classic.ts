import { DateDisplayExportOption, EntryTypeExportOption, TimesheetEntryType } from "@/lib/constants/constant"
import { TimesheetRecord } from "../timesheet/timesheetRecord"
import { ExportOptions } from "@/lib/types/timesheet";
import { TimesheetHour } from "../timesheet/timesheetHour";

export class ClassicTemplate {
    static workingPeriods(timesheetRecord: TimesheetRecord) {
        const _workingTimeList = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.workingTime).map((_workingTimeEntry) => {
            return { startTime: _workingTimeEntry.entryPeriodStartTime, finishTime: _workingTimeEntry.entryPeriodFinishTime }
        })
        return _workingTimeList;
    }

    static workingPeriod1(timesheetRecord: TimesheetRecord) {
        const index = 0
        const _workingEntryFilter = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug === TimesheetEntryType.workingTime);
        const _workingEntry = _workingEntryFilter.length > 0 ? _workingEntryFilter[0] : undefined;
        if (_workingEntry) return { startTime: _workingEntry.entryPeriodStartTime, finishTime: _workingEntry.entryPeriodFinishTime }
        throw Error("No working Time");
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

    static hasWorkingPeriod(timesheetRecord: TimesheetRecord) {
        return (ClassicTemplate.hasWorkingPeriod1(timesheetRecord) || ClassicTemplate.hasWorkingPeriod2(timesheetRecord) || ClassicTemplate.hasWorkingPeriod3(timesheetRecord) || ClassicTemplate.hasWorkingPeriod4(timesheetRecord))
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

    static hasWaitingPeriod(timesheetRecord: TimesheetRecord) {
        return (ClassicTemplate.hasWaitingPeriod1(timesheetRecord) || ClassicTemplate.hasWaitingPeriod2(timesheetRecord))
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

    static hasTravelPeriod(timesheetRecord: TimesheetRecord) {
        return (ClassicTemplate.hasTravelPeriod1(timesheetRecord) || ClassicTemplate.hasTravelPeriod2(timesheetRecord))
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

    static isValid(timesheetRecord: TimesheetRecord, exportOptions: ExportOptions) {
        // if timesheet has hours it is valid
        // however there are edge cases - 
        /***
         * if it has hours, 
         * but the export option says we should not include travel time or waiting time, 
         * and the timesheet record does not have a working period at
         * it only has either a travel time or waiting waiting time
         * thus it should be treated as invalid 
         * */
        return !(timesheetRecord.hasHours && exportOptions.entryTypeDisplay === EntryTypeExportOption.showOnlyWorkingTime && !ClassicTemplate.hasWorkingPeriod(timesheetRecord));
    }

    static getFilteredTimesheetRecord(timesheetRecord: TimesheetRecord, filter: EntryTypeFilter) {
        const _plainRecord = timesheetRecord.convertToPlain();
        let _referenceRecord: TimesheetRecord
        if (filter === EntryTypeFilter.workingTime) {
            _referenceRecord = new TimesheetRecord({ ..._plainRecord, entries: _plainRecord.entries.filter((_entry) => _entry.entryType.slug == TimesheetEntryType.workingTime) });
        } else if (filter === EntryTypeFilter.waitingTime) {
            _referenceRecord = new TimesheetRecord({ ..._plainRecord, entries: _plainRecord.entries.filter((_entry) => (_entry.entryType.slug == TimesheetEntryType.workingTime || _entry.entryType.slug === TimesheetEntryType.waitingTime)) });
        } else if (filter === EntryTypeFilter.travelTime) {
            _referenceRecord = new TimesheetRecord({ ..._plainRecord, entries: _plainRecord.entries.filter((_entry) => (_entry.entryType.slug == TimesheetEntryType.workingTime || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization || _entry.entryType.slug === TimesheetEntryType.travelTimeToSite || _entry.entryType.slug === TimesheetEntryType.travelTimeFromSite)) });
        } else {
            _referenceRecord = new TimesheetRecord({ ..._plainRecord, entries: _plainRecord.entries.filter((_entry) => (_entry.entryType.slug == TimesheetEntryType.workingTime || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization || _entry.entryType.slug === TimesheetEntryType.travelTimeToSite || _entry.entryType.slug === TimesheetEntryType.travelTimeFromSite || _entry.entryType.slug === TimesheetEntryType.waitingTime)) });
        }
        return _referenceRecord;
    }
    /**
     * Calculates totalHours for a timesheet record, to be used on the exported classic timesheet
     * @param timesheetRecord TimesheetRecord
     * @param exportOptions ExportOptions
     */
    static getTotalHours(timesheetRecord: TimesheetRecord, exportOptions: ExportOptions): string {
        const _initialHours: TimesheetHour = new TimesheetHour("00:00");
        if (!ClassicTemplate.isValid(timesheetRecord, exportOptions)) return _initialHours.time

        let _referenceRecord: TimesheetRecord

        if (exportOptions.entryTypeDisplay === EntryTypeExportOption.showOnlyWorkingTime) {
            _referenceRecord = ClassicTemplate.getFilteredTimesheetRecord(timesheetRecord, EntryTypeFilter.workingTime)

        } else if (exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelTimeInReport) {
            _referenceRecord = ClassicTemplate.getFilteredTimesheetRecord(timesheetRecord, EntryTypeFilter.travelTime)

        } else if (exportOptions.entryTypeDisplay === EntryTypeExportOption.includeWaitingTimeInReport) {
            _referenceRecord = ClassicTemplate.getFilteredTimesheetRecord(timesheetRecord, EntryTypeFilter.waitingTime)
        } else if (exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelAndWaitingTimeInReport) {
            _referenceRecord = ClassicTemplate.getFilteredTimesheetRecord(timesheetRecord, EntryTypeFilter.all)
        } else {
            _referenceRecord = timesheetRecord
        }
        return _referenceRecord.totalHours.time;
    }

    static getComment(timesheetRecord: TimesheetRecord, exportOptions: ExportOptions) {
        if (!ClassicTemplate.isValid(timesheetRecord, exportOptions)) return ''
        let _referenceRecord: TimesheetRecord
        if (exportOptions.entryTypeDisplay === EntryTypeExportOption.showOnlyWorkingTime) {
            _referenceRecord = ClassicTemplate.getFilteredTimesheetRecord(timesheetRecord, EntryTypeFilter.workingTime)

        } else if (exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelTimeInReport) {
            _referenceRecord = ClassicTemplate.getFilteredTimesheetRecord(timesheetRecord, EntryTypeFilter.travelTime)
        } else if (exportOptions.entryTypeDisplay === EntryTypeExportOption.includeWaitingTimeInReport) {
            _referenceRecord = ClassicTemplate.getFilteredTimesheetRecord(timesheetRecord, EntryTypeFilter.waitingTime)
        } else if (exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelAndWaitingTimeInReport) {
            _referenceRecord = ClassicTemplate.getFilteredTimesheetRecord(timesheetRecord, EntryTypeFilter.all)
        } else {
            _referenceRecord = timesheetRecord
        }
        return _referenceRecord.consolidatedComment;
    }
}

enum EntryTypeFilter {
    workingTime = 'working-time',
    waitingTime = 'waiting-time',
    travelTime = 'travel-time',
    all = 'all'
}