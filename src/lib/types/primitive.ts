/**
 * Primitives are for forms
 */

import { LocationType } from "../constants/constant"
import { PlainTimesheetEntryType } from "./timesheet"

export interface PrimitiveDefaultTimesheetEntry {
    id?: number
    startTime: string,
    finishTime: string,
    locationType: LocationType,
    comment: string,
    weekStartDay: string,
    updatedAt: string,
    timesheetEntryType?: PlainTimesheetEntryType
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