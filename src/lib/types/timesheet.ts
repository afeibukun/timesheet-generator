import { EntryStateLabel, LocationType } from "../constants/constant"
import { Personnel } from "../services/meta/personnel";
import { Timesheet } from "../services/timesheet/timesheet";
import { TimesheetRecord } from "../services/timesheet/timesheetRecord";
import { TimesheetDate } from "../services/timesheet/timesheetDate"
import { TimesheetEntry } from "../services/timesheet/timesheetEntry";
import { Customer } from "../services/meta/customer";
import { Site } from "../services/meta/site";
import { Project } from "../services/meta/project";

// A timesheet refers to a week group of timesheet entries. it cannot overlap months though
export interface TimesheetInterface {
    id?: number,
    key: number,
    personnel: Personnel;
    weekEndingDate: TimesheetDate;
    customer: Customer;
    site: Site;
    project: Project;
    options: TimesheetOptionInterface[];
    records: TimesheetRecord[];
    comment: string;
}

export interface TimesheetCollection {
    id?: number,
    key: number,
    collection: Timesheet[];
}

export interface TimesheetCollectionByMonthInterface {
    id?: number,
    collection: TimesheetInterface[][];

}

// TIMESHEET OPTIONS examples (mobilization date, demob date)
export interface TimesheetOptionInterface {
    id?: number,
    key: any,
    value: any,
}

// DATE
export interface TimesheetDateInterface {
    date: string,
}

export type MobilizationDateInformation = {
    mobilizationDate: string,
    demobilizationDate: string
}

// TIMESHEET ENTRY
export interface TimesheetEntryCollectionInterface { // to be renamed to TimesheetEntryInterface
    user_id: number;
    date: TimesheetDate;
    collectionOptions: TimesheetCollectionOptionsInterface[],
    entryCollection: TimesheetEntry[];
}

export interface TimesheetEntryPeriodInterface {
    startTime?: TimesheetHourInterface,
    finishTime?: TimesheetHourInterface,
    breakTimeStart?: TimesheetHourInterface,
    breakTimeFinish?: TimesheetHourInterface
}

export interface TimesheetHourInterface {
    hour?: number,
    minute?: number,
}

export interface TimesheetRecordInterface {
    id?: number,
    date: TimesheetDateInterface,
    entries: TimesheetEntryInterface[],
    comment?: string,
}

export interface TimesheetEntryInterface {
    id?: number,
    date: TimesheetDateInterface,
    entryType: TimesheetEntryTypeInterface
    entryPeriod: TimesheetEntryPeriodInterface,
    locationType?: LocationType,
    hasPremium?: boolean
    comment?: string,
}

export interface TimesheetEntryTypeInterface {
    id?: number
    slug: string
    name: string
}

type EntryState = {
    entryId: number,
    state: EntryStateLabel
}

export interface TimesheetCollectionOptionsInterface {
    key: string,
    value: any
}