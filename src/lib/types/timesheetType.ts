import { EntryStateEnum, LocationTypeEnum } from "../constants/enum"
import { Personnel } from "../services/personnel";
import { Timesheet } from "../services/timesheet/timesheet";
import { TimesheetDate } from "../services/timesheet/timesheetDate"
import { TimesheetEntry } from "../services/timesheet/timesheetEntry";
import { TimesheetEntryPeriod } from "../services/timesheet/timesheetEntryPeriod";
import { TimesheetMeta } from "../services/timesheet/timesheetMeta";

// A timesheet refers to a week group of timesheet entries. it cannot overlap months though
export interface TimesheetInterface {
    id?: number
    personnel: Personnel;
    weekEndingDate: TimesheetDate;
    customer: CustomerInterface;
    site: SiteInterface;
    project: ProjectInterface;
    options: TimesheetOptionInterface[];
    entries: TimesheetEntry[];
    comment: string;
}

export interface PrimitiveTimesheetInterface {
    id?: number,
    customerSlug: string,
    siteSlug: string,
    projectId: number,
    options: TimesheetOptionInterface[],
    entries: PrimitiveTimesheetEntryInterface[],
    comment: string,
}

export interface TimesheetCollectionInterface {
    id?: number,
    collection: Timesheet[];
}

export interface TimesheetCollectionByMonthInterface {
    id?: number,
    collection: TimesheetInterface[][];

}

// META
export interface PrimitiveTimesheetMetaInterface {
    id: number | null,
    personnelName: string,
    mobilizationDate: string,
    demobilizationDate: string,
    customerName: string,
    siteName: string,
    siteCountry: string,
    purchaseOrderNumber: string,
    orderNumber: string | null
}

export interface TimesheetMetaInterface {
    id: number | null,
    personnel: Personnel,
    mobilizationDate: TimesheetDate,
    demobilizationDate: TimesheetDate,
    customerName: string,
    siteName: string,
    siteCountry: string,
    purchaseOrderNumber: string,
    orderNumber: string | null
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

// SITE
export interface SiteInterface {
    id?: number,
    slug: string,
    name: string,
    description?: string,
    country: string
}

// CUSTOMER
export interface CustomerInterface {
    id: number,
    slug: string,
    name: string,
}

// PROJECT
export interface ProjectInterface {
    id?: number
    purchaseOrderNumber: string,
    orderNumber?: string
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

export interface DefaultPrimitiveTimesheetEntryDataInterface {
    startTime: string,
    finishTime: string,
    locationType: LocationTypeEnum,
    comment: string,
    weekStartDay: string,
    updatedAt: string,
    timesheetEntryType?: TimesheetEntryTypeInterface
}

export interface PrimitiveTimesheetEntryDataInterface {
    id: number
    startTime: string,
    finishTime: string,
    locationType: string,
    comment: string,
    state: EntryStateEnum,
    updatedAt: TimesheetDate | null,
    isRecentlySaved: boolean
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


export interface TimesheetEntryInterface {
    id?: number,
    date: TimesheetDateInterface,
    entryType: TimesheetEntryTypeInterface
    entryPeriod: TimesheetEntryPeriodInterface,
    locationType?: LocationTypeEnum,
    hasPremium?: boolean
    comment?: string,
}

export interface PrimitiveTimesheetEntryInterface {
    id: number,
    date: string,
    entryTypeSlug: string
    entryPeriodStartTime: string,
    entryPeriodFinishTime: string,
    breakPeriodStartTime: string,
    breakPeriodFinishTime: string,
    locationType?: string,
    hasPremium: boolean,
    comment?: string,
}

export interface TimesheetEntryTypeInterface {
    id?: number
    slug: string
    name: string
}

type EntryState = {
    entryId: number,
    state: EntryStateEnum
}

interface TimesheetLocalStorageInterface {
}

export interface TimesheetCollectionOptionsInterface {
    key: string,
    value: any
}