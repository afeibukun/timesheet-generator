import { ProjectInterface, SiteInterface } from "@/lib/types/meta";
import { getTimesheetEntryDefaultData } from "../indexedDB/indexedDBService";
import { AppOptionSchema } from "@/lib/types/schema";
import { PrimitiveDefaultTimesheetEntry } from "@/lib/types/primitive";
import { defaultTimesheetEntryData } from "@/lib/constants/default";
import { CannotParsePrimitiveDataToDefaultTimesheetInformationError } from "../timesheet/timesheetErrors";

export class AppOption {
    id: number;
    key: string;
    value: any;

    constructor(id: number, key: string, value: any) {
        this.id = id;
        this.key = key;
        this.value = value;
    }

}
