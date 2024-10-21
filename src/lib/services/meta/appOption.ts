import { PlainProject, PlainSite } from "@/lib/types/meta";
import { createOrUpdateAppOption, getAppOptionData, getTimesheetEntryDefaultData } from "../indexedDB/indexedDBService";
import { AppOptionSchema } from "@/lib/types/schema";
import { PrimitiveDefaultTimesheetEntry } from "@/lib/types/primitive";
import { defaultTimesheetEntryData } from "@/lib/constants/default";
import { CannotParsePrimitiveDataToDefaultTimesheetInformationError } from "../timesheet/timesheetErrors";
import { AppOptionInterface } from "@/lib/types/generalType";
import { StorageLabel } from "@/lib/constants/storage";
import { ExportOptions } from "@/lib/types/timesheet";

export class AppOption {
    id: number;
    key: string;
    value: any;

    constructor(id: number, key: string, value: any) {
        this.id = id;
        this.key = key;
        this.value = value;
    }

    static async getExportOption() {
        const _exportOption: AppOptionInterface = await getAppOptionData(StorageLabel.exportOptionLabel);
        if (_exportOption) {
            return _exportOption.value as ExportOptions
        }
        throw new Error("Export Option Not Found")
    }

    static async saveExportOption(exportOption: ExportOptions) {
        const _plainExportOption: any = JSON.parse(JSON.stringify(exportOption));
        await createOrUpdateAppOption(StorageLabel.exportOptionLabel, _plainExportOption);
        return exportOption
    }

}
