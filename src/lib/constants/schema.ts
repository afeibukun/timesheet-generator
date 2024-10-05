import { TimesheetDate } from "../services/timesheet/timesheetDate";
import { TimesheetEntry } from "../services/timesheet/timesheetEntry";
import { TimesheetEntryPeriod } from "../services/timesheet/timesheetEntryPeriod";
import { PersonnelInterface, PersonnelOptionInterface } from "../types/personnelType";
import { CustomerInterface, ProjectInterface, SiteInterface, TimesheetCollectionOptionsInterface, TimesheetDateInterface, TimesheetEntryInterface, TimesheetEntryTypeInterface, TimesheetOptionInterface } from "../types/timesheetType";
import { LocationTypeEnum } from "./enum";

export const timesheetDatabaseName = "timesheet_database";

export enum StoreName {
    personnel = "personnel",
    timesheet = "timesheet",
    timesheetCollection = "timesheet_collection",
    customer = "customer",
    project = "project",
    appOption = "app_option"
}

export enum IndexName {
    slugIndex = "slug_index",
    nameIndex = "name_index",
    personnelIndex = "personnel_index",
    weekEndDateIndex = "weekEndDate_index",
    purchaseOrderNumberIndex = "purchaseOrderNumber_index",
    keyIndex = "key_index"
}

export enum FieldName {
    slug = "slug",
    name = "name",
    personnel = "personnel",
    weekEndDate = "weekEndDate",
    purchaseOrderNumber = "purchaseOrderNumber",
    key = "key"
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

export interface TimesheetSchema {
    id?: number
    personnel: PersonnelInterface,
    project: ProjectInterface,
    customer: CustomerInterface,
    site: SiteInterface,
    entries?: TimesheetEntryInterface[],
    options?: TimesheetOptionInterface[],
    weekEndingDate: TimesheetDateInterface,
    comment: string
}

export interface TimesheetCollectionSchema {
    id?: number,
    timesheetIdCollection: number[]
}
