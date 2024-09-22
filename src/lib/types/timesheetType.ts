import { EntryStateEnum, LocationTypeEnum } from "../constants/enum"
import { Personnel } from "../services/personnel";
import { TimesheetDate } from "../services/timesheet/timesheetDate"
import { TimesheetEntry } from "../services/timesheet/timesheetEntry";
import { TimesheetEntryPeriod } from "../services/timesheet/timesheetEntryPeriod";
import { TimesheetMeta } from "../services/timesheet/timesheetMeta";

export interface TimesheetInterface {
    meta: TimesheetMeta;
    entryCollection: TimesheetEntry[];
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

// DATE
export interface TimesheetDateInterface {
    dateInput: string,
}

// SITE
export interface SiteDataInterface {
    id: number,
    slug: string,
    customerSlug: string,
    siteName: string,
    siteDescription?: string,
    siteCountry: string
}

// CUSTOMER
export interface CustomerDataInterface {
    id: number,
    slug: string,
    customerName: string
}

// PROJECT
export interface ProjectDataInterface {
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
    locationType: string,
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
    startTime: string | null,
    finishTime: string | null,
}

export interface TimesheetEntryInterface {
    id: number,
    date: TimesheetDate,
    timesheetEntryType: TimesheetEntryTypeInterface
    entryPeriod: TimesheetEntryPeriod,
    breakPeriod?: TimesheetEntryPeriod,
    locationType?: LocationTypeEnum,
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