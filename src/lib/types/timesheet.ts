import { EntryStateLabel, LocationType } from "../constants/constant"
import { Personnel } from "../services/meta/personnel";
import { Timesheet } from "../services/timesheet/timesheet";
import { TimesheetRecord } from "../services/timesheet/timesheetRecord";
import { TimesheetDate } from "../services/timesheet/timesheetDate"
import { TimesheetEntry } from "../services/timesheet/timesheetEntry";
import { Customer } from "../services/meta/customer";
import { Site } from "../services/meta/site";
import { Project } from "../services/meta/project";
import { PlainCustomer, PlainPersonnel, PlainProject, PlainSite } from "./meta";

// A timesheet refers to a week group of timesheet entries. it cannot overlap months though
export interface PlainTimesheet {
    id?: number,
    key: number,
    personnel: PlainPersonnel;
    weekEndingDate: PlainTimesheetDate;
    customer: PlainCustomer;
    site: PlainSite;
    project: PlainProject;
    options: TimesheetOption[];
    records: PlainTimesheetRecord[];
    comment: string;
}

export interface TimesheetCollection {
    id?: number,
    key: number,
    collection: Timesheet[];
}

export interface TimesheetCollectionByMonth {
    id?: number,
    collection: PlainTimesheet[][];
}

// TIMESHEET OPTIONS examples (mobilization date, demob date)
export interface TimesheetOption {
    id?: number,
    key: any,
    value: any,
}

// DATE
export interface PlainTimesheetDate {
    date: string,
}

export type MobilizationDateInformation = {
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
    date: PlainTimesheetDate,
    entries: PlainTimesheetEntry[],
    comment?: string,
}

export interface PlainTimesheetEntry {
    id?: number,
    date: PlainTimesheetDate,
    entryType: PlainTimesheetEntryType
    entryPeriod: PlainTimesheetEntryPeriod,
    locationType?: LocationType,
    hasPremium?: boolean
    comment?: string,
}

export interface PlainTimesheetEntryType {
    id?: number
    slug: string
    name: string
}

export interface TimesheetCollectionOptions {
    key: string,
    value: any
}