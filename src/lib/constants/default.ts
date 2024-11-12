import { PrimitiveDefaultTimesheetEntry } from "../types/primitive";
import { ExportOptions, PlainTimesheetEntryType } from "../types/timesheet";
import { DateDisplayExportOption, EntryTypeExportOption, LocationType, TimesheetEntryType } from "./constant";

export const defaultTimesheetEntryType: PlainTimesheetEntryType[] = [
    {
        id: 1,
        slug: TimesheetEntryType.travelMobilization,
        name: "Travel Mobilization"
    },
    {
        id: 2,
        slug: TimesheetEntryType.travelDemobilization,
        name: "Travel Demobilization"
    },
    {
        id: 3,
        slug: TimesheetEntryType.workingTime,
        name: "Working Time"
    },
    {
        id: 4,
        slug: TimesheetEntryType.waitingTime,
        name: "Waiting Time"
    },
    {
        id: 5,
        slug: TimesheetEntryType.travelTimeToOrFromSite,
        name: "Daily Travel Time To/From Site"
    }
];

export const defaultTimesheetEntryData: PrimitiveDefaultTimesheetEntry = {
    startTime: '06:00',
    finishTime: '18:00',
    locationType: LocationType.onshore,
    comment: 'Productive Work at the Office',
    weekStartDay: "monday",
    updatedAt: '',
    timesheetEntryType: defaultTimesheetEntryType.filter((entryType) => entryType.slug == "working-time")[0],
    normalWorkingHours: '08:00'
}

export const possibleWeekStartDays = [
    "monday",
    "sunday"
]

export const defaultExportOption: ExportOptions = {
    dateDisplay: DateDisplayExportOption.showAllDatesInTimesheet,
    entryTypeDisplay: EntryTypeExportOption.showOnlyWorkingTime,
    allowMultipleTimeEntries: false
}