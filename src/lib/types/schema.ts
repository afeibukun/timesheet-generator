import { TimesheetDate } from "../services/timesheet/timesheetDate";
import { TimesheetEntry } from "../services/timesheet/timesheetEntry";
import { TimesheetEntryPeriod } from "../services/timesheet/timesheetEntryPeriod";
import { TimesheetCollectionOptions, PlainTimesheetRecord, PlainTimesheetDate, PlainTimesheetEntry, PlainTimesheetEntryType, TimesheetOption } from "./timesheet";
import { LocationType } from "../constants/constant";
import { PlainCustomer, PlainPersonnel, PlainPersonnelOption, PlainProject, PlainSite } from "./meta";

export interface TimesheetSchema {
    id?: number //because when creating a timesheet, the db autogenerates the id, but every other saved timesheet has an id.
    key: number, // also unique
    personnel: PersonnelSchema,
    personnelSlug: string,
    project: PlainProject,
    customer: PlainCustomer,
    site: PlainSite,
    records?: PlainTimesheetRecord[],
    options?: TimesheetOption[],
    weekEndingDate: string, //also needed for indexing
    month: number,
    comment: string
}

export interface TimesheetRecordSchema {
    id?: number // unique    
    entries?: PlainTimesheetEntry[],
    date: string,
    comment: string
}

export interface AppOptionSchema {
    id?: number
    key: string,
    value: any,
}

export interface PersonnelSchema {
    id?: number
    slug: string,
    name: string,
    options?: PlainPersonnelOption[]
}

export interface CustomerSchema {
    id?: number
    slug: string,
    name: string,
    sites: PlainSite[]
}

export interface ProjectSchema {
    id?: number
    purchaseOrderNumber: string,
    orderNumber?: string
}

export interface TimesheetCollectionSchema {
    id?: number,
    key: number,
    timesheetIdCollection: number[]
}
