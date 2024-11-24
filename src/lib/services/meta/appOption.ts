import { AppOptionKey } from "@/lib/types/meta";
import { createOrUpdateAppOption, getAppOptionData } from "../indexedDB/indexedDBService";
import { AppOptionInterface } from "@/lib/types/generalType";
import { StorageLabel } from "@/lib/constants/storage";
import { ExportOptions } from "@/lib/types/timesheet";

export class AppOption {
    id: number;
    key: AppOptionKey;
    value: any;

    constructor(id: number, key: AppOptionKey, value: any) {
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
