/**
 * Primitives are for forms
 */

import { LocationType } from "../constants/constant"


export interface PrimitiveTimesheet {
    id?: number,
    key: number,
    customerSlug: string,
    siteSlug: string,
    projectId: number,
    options: PrimitiveTimesheetOption[],
    records: PrimitiveTimesheetRecord[],
    comment: string,
}

export interface PrimitiveTimesheetOption {
    id: number,
    key: any,
    value: any,
}

export interface PrimitiveTimesheetRecord {
    id?: number,
    date: string,
    entries: PrimitiveTimesheetEntry[],
    comment?: string,
}

export interface PrimitiveDefaultTimesheetEntry {
    id?: number
    startTime: string,
    finishTime: string,
    locationType: LocationType,
    comment: string,
    weekStartDay: string,
    updatedAt: string,
    timesheetEntryType?: PrimitiveTimesheetEntryType
}

/* export interface PrimitiveTimesheetEntryData {
    id: number
    startTime: string,
    finishTime: string,
    locationType: string,
    comment: string,
    state: EntryStateLabel,
    updatedAt: TimesheetDate | null,
    isRecentlySaved: boolean
} */

export interface PrimitiveTimesheetEntry {
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

export interface PrimitiveTimesheetEntryType {
    id?: number
    slug: string
    name: string
}

export interface TimesheetEntryError {
    id: number,
    entryType: { error: boolean, message: string },
    locationType: { error: boolean, message: string },
    entryPeriodStartTime: { error: boolean, message: string },
    entryPeriodFinishTime: { error: boolean, message: string },
    breakPeriodStartTime: { error: boolean, message: string },
    breakPeriodFinishTime: { error: boolean, message: string },
}