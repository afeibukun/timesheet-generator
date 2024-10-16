import { TimesheetDate } from "../services/timesheet/timesheetDate";
import { TimesheetEntry } from "../services/timesheet/timesheetEntry";
import { TimesheetEntryPeriod } from "../services/timesheet/timesheetEntryPeriod";
import { TimesheetCollectionOptionsInterface, TimesheetRecordInterface, TimesheetDateInterface, TimesheetEntryInterface, TimesheetEntryTypeInterface, TimesheetOptionInterface } from "./timesheet";
import { LocationType } from "../constants/constant";
import { CustomerInterface, PersonnelInterface, PersonnelOptionInterface, ProjectInterface, SiteInterface } from "./meta";

export interface TimesheetSchema {
    id?: number //because when creating a timesheet, the db autogenerates the id, but every other saved timesheet has an id.
    key: number, // also unique
    personnel: PersonnelSchema,
    personnelSlug: string,
    project: ProjectInterface,
    customer: CustomerInterface,
    site: SiteInterface,
    records?: TimesheetRecordInterface[],
    options?: TimesheetOptionInterface[],
    weekEndingDate: string, //also needed for indexing
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
    options?: PersonnelOptionInterface[]
}

export interface CustomerSchema {
    id?: number
    slug: string,
    name: string,
    sites: SiteInterface[]
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
