import { DateDisplayExportOption, EntryTypeExportOption, LocationType } from "../constants/constant"
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
    key: any,
    value: any,
}

export type MobilizationDateInformation = {
    mobilizationDate: string,
    demobilizationDate: string
}

export interface TimesheetRecordOption {
    key: any,
    value: any,
}

export interface TimesheetEntryOption {
    key: any,
    value: any,
}

export interface TimesheetCollectionOptions {
    key: string,
    value: any
}

export type ExportOptions = {
    dateDisplay: DateDisplayExportOption,
    entryTypeDisplay: EntryTypeExportOption,
    allowMultipleTimeEntries: boolean
}

/////

// A timesheet refers to a week group of timesheet entries. it cannot overlap months though
export interface PlainTimesheet {
    id?: number,
    key: number,
    personnel: PlainPersonnel;
    personnelSlug?: string;
    weekEndingDate: PlainTimesheetDate;
    month: number;
    customer: PlainCustomer;
    site: PlainSite;
    project: PlainProject;
    options: PlainTimesheetOption[];
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

// TIMESHEET OPTIONS examples (mobilization date, demob date)
export interface PlainTimesheetOption {
    id?: number,
    key: any,
    value: any,
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
    customer: PlainCustomer, // plain customer should have active site selected
    project: PlainProject,
    comment?: string,
    options?: PlainTimesheetRecordOption[]
}

export interface PlainTimesheetRecordOption {
    key: any,
    value: any,
}

export interface PlainTimesheetEntry {
    id?: number | string,
    date: PlainTimesheetDate,
    entryType: PlainTimesheetEntryType
    entryPeriod: PlainTimesheetEntryPeriod,
    locationType?: LocationType,
    hasPremium?: boolean
    comment?: string,
    options?: PlainTimesheetEntryOption[]
}

export interface PlainTimesheetEntryOption {
    key: any,
    value: any,
}

export interface PlainTimesheetEntryType {
    id?: number
    slug: string
    name: string
}

export interface PlainTimesheetCollectionOptions {
    key: string,
    value: any
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