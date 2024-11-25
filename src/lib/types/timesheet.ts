import { DateDisplayExportOption, EntryTypeExportOption, LocationType, OptionLabel } from "../constants/constant"
import { Timesheet } from "../services/timesheet/timesheet";
import { PlainCustomer, PlainPersonnel, PlainProject, PlainSite } from "./meta";

export interface TimesheetCollection {
    id?: number,
    key: number,
    timesheets: Timesheet[];
}

export interface TimesheetCollectionByMonth {
    id?: number,
    collection: Timesheet[][];
}

// TIMESHEET OPTIONS examples (mobilization date, demob date)
export interface TimesheetOption {
    id?: number,
    key: TimesheetOptionKey,
    value: any,
}
export type TimesheetOptionKey = OptionLabel.timesheetWeek | OptionLabel.mobilizationDate | OptionLabel.demobilizationDate | OptionLabel.timesheetCollectionKey

export type MobilizationDateInformation = {
    mobilizationDate: string,
    demobilizationDate: string
}

export interface TimesheetEntryOption {
    key: TimesheetEntryOptionKey,
    value: any,
}
export type TimesheetEntryOptionKey = OptionLabel.excludeEntryFromReport

export interface TimesheetCollectionOption {
    key: TimesheetCollectionOptionKey,
    value: any
}
export type TimesheetCollectionOptionKey = ''

export type ExportOptions = {
    dateDisplay: DateDisplayExportOption,
    entryTypeDisplay: EntryTypeExportOption,
    allowMultipleTimeEntries: boolean
}

/////

// A timesheet refers to a week group of timesheet entries. it cannot overlap months though
export interface PlainTimesheet {
    id?: number,
    key: number | string,
    personnel: PlainPersonnel;
    personnelSlug?: string;
    weekEndingDate: PlainTimesheetDate;
    customer: PlainCustomer; // plain customer should have active site selected
    project: PlainProject;
    options: TimesheetOption[];
    records: PlainTimesheetRecord[];
    comment: string;
}

export interface PlainTimesheetCollection {
    id?: number,
    key: number,
    timesheets?: PlainTimesheet[];
    timesheetIds?: number[]
}

export interface PlainTimesheetCollectionByMonth {
    id?: number,
    collection: PlainTimesheet[][];
}

// DATE
export interface PlainTimesheetDate {
    date: string,
}

export type PlainMobilizationDate = {
    mobilizationDate: string,
    demobilizationDate: string
}

// TIMESHEET ENTRY
export interface PlainTimesheetEntryPeriod {
    startTime?: PlainTimesheetHour,
    finishTime?: PlainTimesheetHour,
    breakTimeStart?: PlainTimesheetHour,
    breakTimeFinish?: PlainTimesheetHour
}

export interface PlainTimesheetHour {
    hour?: number,
    minute?: number,
}

export interface PlainTimesheetRecord {
    id?: number,
    key: number | string,
    date: PlainTimesheetDate,
    entries: PlainTimesheetEntry[],
    comment?: string,
    options?: TimesheetRecordOption[]
}

export interface TimesheetRecordOption {
    key: TimesheetRecordOptionKey,
    value: any,
}
export type TimesheetRecordOptionKey = OptionLabel.isPublicHoliday | 'randomkey' | 'anotherrandomkey'

export interface PlainTimesheetEntry {
    id?: number | string,
    date: PlainTimesheetDate,
    entryType: PlainTimesheetEntryType
    entryPeriod: PlainTimesheetEntryPeriod,
    locationType?: LocationType,
    hasPremium?: boolean
    comment?: string,
    options?: TimesheetEntryOption[]
}

export interface PlainTimesheetEntryType {
    id?: number
    slug: string
    name: string
}

export interface PlainDefaultTimesheetData {
    id?: number
    startTime: string,
    finishTime: string,
    locationType: LocationType,
    comment: string,
    weekStartDay: string,
    updatedAt: string,
    timesheetEntryType: PlainTimesheetEntryType,
    normalWorkingHours: string,
}

export interface TimesheetEntryError {
    id: number | string,
    entryType: { error: boolean, message: string },
    locationType: { error: boolean, message: string },
    entryPeriodStartTime: { error: boolean, message: string },
    entryPeriodFinishTime: { error: boolean, message: string },
    breakPeriodStartTime: { error: boolean, message: string },
    breakPeriodFinishTime: { error: boolean, message: string },
}