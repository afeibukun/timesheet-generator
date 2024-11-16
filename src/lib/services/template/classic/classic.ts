import { EntryTypeExportOption, LocationType, OptionLabel, ReportType, TimesheetEntryType } from "@/lib/constants/constant"
import { TimesheetRecord } from "../../timesheet/timesheetRecord"
import { ExportOptions, TimesheetOption } from "@/lib/types/timesheet";
import { TimesheetHour } from "../../timesheet/timesheetHour";
import { Personnel } from "../../meta/personnel";
import { Project } from "../../meta/project";
import { Site } from "../../meta/site";
import { TimesheetDate } from "../../timesheet/timesheetDate";
import { getTimesheetsInDates } from "../../indexedDB/indexedDBService";
import { Timesheet } from "../../timesheet/timesheet";
import { TimesheetEntry } from "../../timesheet/timesheetEntry";
import { PrimitiveDefaultTimesheetEntry } from "@/lib/types/primitive";
import { Customer } from "../../meta/customer";
import templateConfig from "./template.config";

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
        const _waitingTimeList = timesheetRecord.entries.filter((_entry) => (_entry.entryType.slug === TimesheetEntryType.travelTimeToOrFromSite || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization)).map((_travelTimeEntry) => {
            return { startTime: _travelTimeEntry.entryPeriodStartTime, finishTime: _travelTimeEntry.entryPeriodFinishTime }
        })
        return _waitingTimeList;
    }

    static travelPeriod1(timesheetRecord: TimesheetRecord) {
        const index = 0
        const _travelEntry = timesheetRecord.entries.filter((_entry) => (_entry.entryType.slug === TimesheetEntryType.travelTimeToOrFromSite || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization))[index];
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
        const _travelEntry = timesheetRecord.entries.filter((_entry) => (_entry.entryType.slug === TimesheetEntryType.travelTimeToOrFromSite || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization))[index];
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

    static generateFilename(templateConfig: any, timesheetStartMonth: number, timesheetStartYear: number, personnelName: string, timesheetLabel: string) {
        const fileNameSuffix = templateConfig.fileNameSuffix == undefined || templateConfig.fileNameSuffix == null || templateConfig.fileNameSuffix == '' || !templateConfig.fileNameSuffix ? '' : `-${templateConfig.fileNameSuffix}`
        const timesheetFileName = `${timesheetStartMonth.toString().padStart(2, "0")}-${timesheetStartYear}-${timesheetLabel}-${personnelName}${fileNameSuffix}`;
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
        return !(timesheetRecord && timesheetRecord.hasHours && exportOptions.entryTypeDisplay === EntryTypeExportOption.showOnlyWorkingTime && !ClassicTemplate.hasWorkingPeriod(timesheetRecord));
    }

    static getFilteredTimesheetRecord(timesheetRecord: TimesheetRecord, filter: EntryTypeFilter) {
        const _plainRecord = timesheetRecord.convertToPlain();
        let _referenceRecord: TimesheetRecord
        if (filter === EntryTypeFilter.workingTime) {
            _referenceRecord = new TimesheetRecord({ ..._plainRecord, entries: _plainRecord.entries.filter((_entry) => _entry.entryType.slug == TimesheetEntryType.workingTime) });
        } else if (filter === EntryTypeFilter.waitingTime) {
            _referenceRecord = new TimesheetRecord({ ..._plainRecord, entries: _plainRecord.entries.filter((_entry) => (_entry.entryType.slug == TimesheetEntryType.workingTime || _entry.entryType.slug === TimesheetEntryType.waitingTime)) });
        } else if (filter === EntryTypeFilter.travelTime) {
            _referenceRecord = new TimesheetRecord({ ..._plainRecord, entries: _plainRecord.entries.filter((_entry) => (_entry.entryType.slug == TimesheetEntryType.workingTime || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization || _entry.entryType.slug === TimesheetEntryType.travelTimeToOrFromSite)) });
        } else {
            _referenceRecord = new TimesheetRecord({ ..._plainRecord, entries: _plainRecord.entries.filter((_entry) => (_entry.entryType.slug == TimesheetEntryType.workingTime || _entry.entryType.slug === TimesheetEntryType.travelMobilization || _entry.entryType.slug === TimesheetEntryType.travelDemobilization || _entry.entryType.slug === TimesheetEntryType.travelTimeToOrFromSite || _entry.entryType.slug === TimesheetEntryType.waitingTime)) });
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

    static getWorkingTimeForInternalReport(timesheetRecord: TimesheetRecord) {
        const _workingTimeTotalHours = timesheetRecord.entries.filter((_entry) => _entry.entryType.slug == TimesheetEntryType.workingTime && !TimesheetEntry.isExcludedFromReport(_entry, ReportType.internal)).reduce((_accumulator, _workingTimeEntry) => {
            return TimesheetHour.sumTimesheetHours(_accumulator, _workingTimeEntry.totalHours)
        }, new TimesheetHour("00:00"))
        return _workingTimeTotalHours
    }

    static getTravelTimeForInternalReport(timesheetRecord: TimesheetRecord) {
        const _travelTimeTotalHours = timesheetRecord.entries.filter((_entry) => (_entry.entryType.slug == TimesheetEntryType.travelMobilization || _entry.entryType.slug == TimesheetEntryType.travelDemobilization || _entry.entryType.slug == TimesheetEntryType.travelTimeToOrFromSite) && !TimesheetEntry.isExcludedFromReport(_entry, ReportType.internal)).reduce((_accumulator, _travelTimeEntry) => {
            return TimesheetHour.sumTimesheetHours(_accumulator, _travelTimeEntry.totalHours)
        }, new TimesheetHour("00:00"))
        return _travelTimeTotalHours
    }

    static getTotalHoursForInternalReport(timesheetRecord: TimesheetRecord) {
        const hours = timesheetRecord.entries.filter((_entry) => !TimesheetEntry.isExcludedFromReport(_entry, ReportType.internal)).reduce((accumulator, timesheetEntry) => {
            accumulator = TimesheetHour.sumTimesheetHours(timesheetEntry.totalHours, accumulator)
            return accumulator
        }, new TimesheetHour("00:00"));
        return hours
    }

    static async overtimeAInternalReport(date: TimesheetDate, hasPremium: boolean, isPublicHoliday: boolean, totalHours: TimesheetHour) {
        const isRecordOnAWeekDay = TimesheetDate.isWeekDay(date)
        const isRecordOnASaturday = TimesheetDate.isSaturday(date)
        if (isRecordOnAWeekDay && !hasPremium && !isPublicHoliday) {
            let defaultNormalWorkingTime = new TimesheetHour('08:00');
            let defaultData: PrimitiveDefaultTimesheetEntry = await TimesheetEntry.defaultInformation();
            if (defaultData.normalWorkingHours && defaultData.normalWorkingHours != '00:00') defaultNormalWorkingTime = new TimesheetHour(defaultData.normalWorkingHours);
            const overtimeHours = TimesheetHour.subtractTimesheetHours(totalHours, defaultNormalWorkingTime);
            return overtimeHours
        } else if ((isRecordOnAWeekDay && hasPremium) || (isRecordOnASaturday && !hasPremium && !isPublicHoliday)) {
            const overtimeHours = totalHours;
            return overtimeHours
        } else {
            return new TimesheetHour('00:00')
        }
    }

    static async overtimeBInternalReport(date: TimesheetDate, hasPremium: boolean, isPublicHoliday: boolean, totalHours: TimesheetHour) {
        const isRecordOnASunday = TimesheetDate.isSunday(date)
        const isRecordOnASaturday = TimesheetDate.isSaturday(date)
        if (isRecordOnASunday || isPublicHoliday || (isRecordOnASaturday && hasPremium)) {
            const overtimeHours = totalHours;
            return overtimeHours
        } else {
            return new TimesheetHour('00:00')
        }
    }

    static colaRequired(timesheetRecord: TimesheetRecord) {
        try {
            const recordHasColaOption = timesheetRecord.options ? timesheetRecord.options.some((_option) => _option.key == OptionLabel.isColaRequired) : false
            if (recordHasColaOption) return !!(timesheetRecord?.options?.find((_option) => _option.key == OptionLabel.isColaRequired)?.value)
        } catch (e) { }
        return false
    }

    static getDatesForInternalTimesheetReport(month: number, year: number, cutOffDay?: number, includePreviousMonth?: boolean) {
        const referenceDayInCurrentMonth = TimesheetDate.getDayObjectWithMonth(month, year)
        const firstDayOfTheMonth = TimesheetDate.getFirstDayOfMonth(referenceDayInCurrentMonth);
        const daysInMonth = TimesheetDate.daysInMonth(firstDayOfTheMonth);
        const lastDayOfTheMonth = TimesheetDate.getLastDayOfMonth(firstDayOfTheMonth);

        let startDateCurrentMonth = firstDayOfTheMonth;
        let finishDateCurrentMonth: TimesheetDate;
        let startDatePreviousMonth: TimesheetDate;
        let finishDatePreviousMonth: TimesheetDate;
        let daysInReport: TimesheetDate[] = []
        if (cutOffDay && cutOffDay < daysInMonth && cutOffDay > 1) {
            finishDateCurrentMonth = TimesheetDate.getDayOfMonth(referenceDayInCurrentMonth, cutOffDay);
            const referenceDayInPreviousMonth = firstDayOfTheMonth.dateDecrementByMonth(1);
            const daysInPreviousMonth = TimesheetDate.daysInMonth(referenceDayInPreviousMonth);
            if (cutOffDay + 1 <= daysInPreviousMonth && includePreviousMonth !== undefined && includePreviousMonth === true) {
                startDatePreviousMonth = TimesheetDate.getDayOfMonth(referenceDayInPreviousMonth, cutOffDay + 1);
                finishDatePreviousMonth = TimesheetDate.getLastDayOfMonth(referenceDayInPreviousMonth);
                let _cursorDay = startDatePreviousMonth;
                while (TimesheetDate.dayDifference(_cursorDay, finishDatePreviousMonth) >= 0) {
                    daysInReport = [...daysInReport, _cursorDay]
                    _cursorDay = _cursorDay.dateIncrementByDay(1)
                }
            }
        } else {
            finishDateCurrentMonth = lastDayOfTheMonth;
        }
        let _cursorDay = startDateCurrentMonth;
        while (TimesheetDate.dayDifference(_cursorDay, finishDateCurrentMonth) >= 0) {
            daysInReport = [...daysInReport, _cursorDay]
            _cursorDay = _cursorDay.dateIncrementByDay(1)
        }

        return daysInReport

    }

    static async getTimesheetsWithinDates(dates: TimesheetDate[]) {
        const timesheetSchemas = await getTimesheetsInDates(dates)
        let timesheets: Timesheet[] = [];
        for (let i = 0; i < timesheetSchemas.length; i++) {
            const timesheet: Timesheet = await Timesheet.convertSchemaToTimesheet(timesheetSchemas[i]);
            timesheets = [...timesheets, timesheet]
        }
        return timesheets
    }

    static async generateInternalTimesheetRecordFromTimesheet(timesheets: Timesheet[], reportDays: TimesheetDate[]) {
        let internalReportRecords: InternalReportTimesheetRecord[] = []
        for (let i = 0; i < reportDays.length; i++) {
            const _date = reportDays[i];
            const _timesheetThatHoldsDate = timesheets.find((_timesheet) => _timesheet.records.some((_record) => TimesheetDate.areDateStringsSameDay(_record.date.defaultFormat(), _date.defaultFormat())))
            const _recordForDate = _timesheetThatHoldsDate?.records.find((_record) => TimesheetDate.areDateStringsSameDay(_record.date.defaultFormat(), _date.defaultFormat()));

            let _internalRecordForDate: InternalReportTimesheetRecord = {
                date: _date,
                overtime: {},
                hardshipLocation: {
                    cola: false,
                    onshore: false,
                    offshore: false
                },
                premium: false,
                publicHoliday: false,
            }
            if (_recordForDate) {
                try {
                    let workingPeriod = ClassicTemplate.workingPeriod1(_recordForDate);
                    const totalWorkingTime = this.getWorkingTimeForInternalReport(_recordForDate)
                    _internalRecordForDate = {
                        ..._internalRecordForDate,
                        startTime: new TimesheetHour(workingPeriod.startTime),
                        finishTime: new TimesheetHour(workingPeriod.finishTime),
                        workingTime: totalWorkingTime
                    };
                } catch (e) { }

                try {
                    let travelPeriod = ClassicTemplate.travelPeriod1(_recordForDate);
                    const totalTravelTime = this.getTravelTimeForInternalReport(_recordForDate);

                    _internalRecordForDate = {
                        ..._internalRecordForDate,
                        travelTime: totalTravelTime
                    };
                } catch (e) { }

                const totalHours = this.getTotalHoursForInternalReport(_recordForDate);
                const hasPremium = TimesheetRecord.hasPremium(_recordForDate)
                const isPublicHoliday = TimesheetRecord.hasPublicHoliday(_recordForDate)
                try {
                    let overtimeA = await this.overtimeAInternalReport(_recordForDate.date, hasPremium, isPublicHoliday, totalHours);
                    let overtimeB = await this.overtimeBInternalReport(_recordForDate.date, hasPremium, isPublicHoliday, totalHours);
                    _internalRecordForDate = {
                        ..._internalRecordForDate,
                        overtime: {
                            typeA: overtimeA,
                            typeB: overtimeB
                        },
                    }
                } catch (e) { }

                _internalRecordForDate = {
                    ..._internalRecordForDate,
                    totalHours: totalHours,
                    hardshipLocation: {
                        onshore: _recordForDate.locationType === LocationType.onshore,
                        offshore: _recordForDate.locationType === LocationType.offshore,
                        cola: this.colaRequired(_recordForDate)
                    },
                    premium: hasPremium,
                    publicHoliday: isPublicHoliday,
                }

            }
            internalReportRecords = [...internalReportRecords, _internalRecordForDate];
        }
        return internalReportRecords
    }

    static getProjectsForInternalTimesheetReport(timesheets: Timesheet[]) {
        let projects: Project[] = []

        for (let i = 0; i < timesheets.length; i++) {
            const _project = timesheets[i].project
            const alreadyInProjects = projects.some((_p) => _p.purchaseOrderNumber === _project.purchaseOrderNumber)
            if (!alreadyInProjects) {
                projects = [...projects, _project]
            }
        }
        return projects
    }

    static getCustomersForInternalTimesheetReport(timesheets: Timesheet[]) {
        let customers: Customer[] = []

        for (let i = 0; i < timesheets.length; i++) {
            const _customer = timesheets[i].customer
            const alreadyInCustomer = customers.some((_c) => _c.slug === _customer.slug)
            if (!alreadyInCustomer) {
                customers = [...customers, _customer]
            }
        }
        return customers
    }

    static getSitesForInternalTimesheetReport(timesheets: Timesheet[]) {
        let sites: Site[] = []

        for (let i = 0; i < timesheets.length; i++) {
            const _site = timesheets[i].site
            const alreadyInSites = sites.some((_s) => _s.slug === _site.slug)
            if (!alreadyInSites) {
                sites = [...sites, _site]
            }
        }
        return sites
    }

    static async generateInternalTimesheetReportCollection(month: number, year: number, personnel: Personnel, cutOffDay?: number, includePreviousMonth?: boolean) {
        const daysInReport = ClassicTemplate.getDatesForInternalTimesheetReport(month, year, cutOffDay, includePreviousMonth);
        const timesheets = await this.getTimesheetsWithinDates(daysInReport)

        const _projectsWithinTimeFrame: Project[] = this.getProjectsForInternalTimesheetReport(timesheets)
        const _customersWithinTimeFrame: Customer[] = this.getCustomersForInternalTimesheetReport(timesheets)
        const _sitesWithinTimeFrame: Site[] = this.getSitesForInternalTimesheetReport(timesheets)
        const _optionsWithinTimeFrame: TimesheetOption[] = []
        const _cutOffDay = cutOffDay ? cutOffDay : ""
        const _internalRecordWithinTimeFrame = await this.generateInternalTimesheetRecordFromTimesheet(timesheets, daysInReport);
        const totalOvertimeA = this.getTotalOvertimeAInInternalReport(_internalRecordWithinTimeFrame);
        const totalOvertimeB = this.getTotalOvertimeBInInternalReport(_internalRecordWithinTimeFrame);
        const countCola = this.countTotalColaInInternalReport(_internalRecordWithinTimeFrame);
        const countOnshoreHardship = this.countTotalOnshoreHardshipInInternalReport(_internalRecordWithinTimeFrame);
        const countOffshoreHardship = this.countTotalOffshoreHardshipInInternalReport(_internalRecordWithinTimeFrame);
        const countPremium = this.countTotalPremiumDaysInInternalReport(_internalRecordWithinTimeFrame);
        const _internalReportTimesheet: InternalReportTimesheetCollection = {
            month: month, year: year, cutOffDay: _cutOffDay, personnel: personnel, projects: _projectsWithinTimeFrame, customers: _customersWithinTimeFrame, sites: _sitesWithinTimeFrame, records: _internalRecordWithinTimeFrame, options: _optionsWithinTimeFrame, total: { overtime: { typeA: totalOvertimeA, typeB: totalOvertimeB }, hardship: { cola: countCola, onshore: countOnshoreHardship, offshore: countOffshoreHardship }, premium: countPremium },
            approvalManagerName: templateConfig.data.internalReport.managerName
        }
        return _internalReportTimesheet
    }

    static getTotalOvertimeAInInternalReport(internalReportRecords: InternalReportTimesheetRecord[],) {
        const totalOvertimeA = internalReportRecords.reduce((acc, _internalReport) => {
            if (_internalReport.overtime.typeA) return TimesheetHour.sumTimesheetHours(acc, _internalReport.overtime.typeA);
            else return acc
        }, new TimesheetHour('00:00'))
        return totalOvertimeA
    }

    static getTotalOvertimeBInInternalReport(internalReportRecords: InternalReportTimesheetRecord[],) {
        const totalOvertimeB = internalReportRecords.reduce((acc, _internalReport) => {
            if (_internalReport.overtime.typeB) return TimesheetHour.sumTimesheetHours(acc, _internalReport.overtime.typeB);
            else return acc
        }, new TimesheetHour('00:00'))
        return totalOvertimeB
    }

    static countTotalColaInInternalReport(internalReportRecords: InternalReportTimesheetRecord[]) {
        const totalColaCount = internalReportRecords.reduce((acc, _internalReport) => {
            if (_internalReport.hardshipLocation.cola === true) return acc += 1
            else return acc
        }, 0)
        return totalColaCount
    }

    static countTotalOnshoreHardshipInInternalReport(internalReportRecords: InternalReportTimesheetRecord[]) {
        const totalOnshoreHardshipCount = internalReportRecords.reduce((acc, _internalReport) => {
            if (_internalReport.hardshipLocation.onshore === true) return acc += 1
            else return acc
        }, 0)
        return totalOnshoreHardshipCount
    }

    static countTotalOffshoreHardshipInInternalReport(internalReportRecords: InternalReportTimesheetRecord[]) {
        const totalOffshoreHardshipCount = internalReportRecords.reduce((acc, _internalReport) => {
            if (_internalReport.hardshipLocation.offshore === true) return acc += 1
            else return acc
        }, 0)
        return totalOffshoreHardshipCount
    }

    static countTotalPremiumDaysInInternalReport(internalReportRecords: InternalReportTimesheetRecord[]) {
        const totalPremiumCount = internalReportRecords.reduce((acc, _internalReport) => {
            if (_internalReport.premium === true) return acc += 1
            else return acc
        }, 0)
        return totalPremiumCount
    }

    static countTotalPublicHolidaysInInternalReport(internalReportRecords: InternalReportTimesheetRecord[]) {
        const totalPublicHolidayCount = internalReportRecords.reduce((acc, _internalReport) => {
            if (_internalReport.publicHoliday === true) return acc += 1
            else return acc
        }, 0)
        return totalPublicHolidayCount
    }

    static getOrderNumberForInternalReport(internalReportTimesheet: InternalReportTimesheetCollection) {
        const compiledOrderNumber = internalReportTimesheet.projects.reduce((orderNumber, project) => {
            return project.orderNumber ? `${orderNumber}, ${project.orderNumber}` : orderNumber
        }, '')
        return compiledOrderNumber
    }

    static getCustomerNameForInternalReport(internalReportTimesheet: InternalReportTimesheetCollection) {
        const compiledCustomerName = internalReportTimesheet.customers.reduce((customerName, customer) => `${customerName}${customerName != '' ? ',' : ''} ${customer.name}`, '')
        return compiledCustomerName
    }

    static getSiteNameForInternalReport(internalReportTimesheet: InternalReportTimesheetCollection) {
        const compiledSiteName = internalReportTimesheet.sites.reduce((siteName, site) => site.name ? `${siteName}${siteName != '' ? ',' : ''} ${site.name}` : siteName, '')
        return compiledSiteName
    }
    static getSiteCountryForInternalReport(internalReportTimesheet: InternalReportTimesheetCollection) {
        const compiledSiteCountry = internalReportTimesheet.sites.reduce((siteCountry, site) => {
            if (site.country && !siteCountry.includes(site.country)) return `${siteCountry}${siteCountry != '' ? '/' : ''} ${site.country}`
            return siteCountry
        }, '')
        return compiledSiteCountry
    }

    static getTeamLeadNameForInternalReport(internalReportTimesheet: InternalReportTimesheetCollection) {
        const compiledTeamLeadName = internalReportTimesheet.options.reduce((teamLeadName, option) => {
            if (option.key == OptionLabel.teamLeadName) {
                return `${teamLeadName}${teamLeadName != '' ? '/' : ''} ${option.value}`
            } else return teamLeadName
        }, '')
        if (compiledTeamLeadName == '') return internalReportTimesheet.personnel.name
        return compiledTeamLeadName
    }

    static getPersonnelCodeForInternalReport(internalReportTimesheet: InternalReportTimesheetCollection) {
        let personnelCode = ''
        try {
            const codeAs = internalReportTimesheet.options.filter((option) => option.key == OptionLabel.personnelCodeA);
            const codeBs = internalReportTimesheet.options.filter((option) => option.key == OptionLabel.personnelCodeB);
            if (codeAs) personnelCode = codeAs[0].value
            if (codeBs) personnelCode = `${personnelCode != '' ? personnelCode + ' / ' : ''}${codeBs[0].value}`
        } catch (err) { }
        return personnelCode
    }

    static getProjectDescriptionForInternalReport(internalReportTimesheet: InternalReportTimesheetCollection) {
        const compiledProjectDescription = internalReportTimesheet.projects.reduce((projectDescription, project) => {
            if (project.description && !projectDescription.includes(project.description)) return `${projectDescription}${projectDescription != '' ? '/' : ''} ${project.description}`
            return projectDescription
        }, '')
        return compiledProjectDescription
    }

    static getDayForInternalReport(internalReportRecord: InternalReportTimesheetRecord) {
        return internalReportRecord.date.basicFormat()
    }
    static getDayLabelForInternalReport(internalReportRecord: InternalReportTimesheetRecord) {
        return internalReportRecord.date.dayLabel
    }

    static getMonthLabelForInternalReport(internalReportTimesheet: InternalReportTimesheetCollection) {
        // return TimesheetDate.monthsInYear[internalReportTimesheet.month]
        return TimesheetDate.monthsInYearShort[internalReportTimesheet.month]
    }
}

enum EntryTypeFilter {
    workingTime = 'working-time',
    waitingTime = 'waiting-time',
    travelTime = 'travel-time',
    all = 'all'
}

export interface InternalReportTimesheetCollection {
    month: number,
    year: number,
    cutOffDay: number | string,
    personnel: Personnel,
    projects: Project[],
    customers: Customer[],
    sites: Site[],
    records: InternalReportTimesheetRecord[],
    options: TimesheetOption[],
    total: {
        overtime: {
            typeA: TimesheetHour,
            typeB: TimesheetHour,
        },
        hardship: {
            cola: number,
            onshore: number,
            offshore: number
        },
        premium: number
    },
    approvalManagerName: string
}

export interface InternalReportTimesheetRecord {
    date: TimesheetDate,
    workingTime?: TimesheetHour,
    travelTime?: TimesheetHour,
    nightShift?: TimesheetHour,
    startTime?: TimesheetHour,
    finishTime?: TimesheetHour,
    totalHours?: TimesheetHour,
    overtime: {
        typeA?: TimesheetHour,
        typeB?: TimesheetHour,
    },
    hardshipLocation: {
        cola: boolean,
        onshore: boolean,
        offshore: boolean,
    },
    premium: boolean,
    publicHoliday: boolean,
}


