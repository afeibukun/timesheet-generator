import { TimesheetDate } from "../services/timesheet/timesheetDate";
import { TimesheetEntryPeriod } from "../services/timesheet/timesheetEntryPeriod";
import { PersonnelOptionInterface } from "../types/personnelType";
import { TimesheetCollectionOptionsInterface, TimesheetEntryTypeInterface } from "../types/timesheetType";
import { LocationTypeEnum } from "./enum";

export const timesheetDatabaseName = "timesheet_database";

export const personnelStoreName = "personnel";
export const timesheetStoreName = "timesheet";
export const customerStoreName = "customer";
export const siteStoreName = "site";
export const projectStoreName = "project";
export const appOptionStoreName = "app_option";

export interface AppOptionSchema {
    key: string,
    value: any,
}

