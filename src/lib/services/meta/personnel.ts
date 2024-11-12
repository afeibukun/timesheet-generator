import { StorageLabel, StoreName } from "../../constants/storage";
import { PersonnelSchema } from "../../types/schema";
import { AppOptionInterface } from "../../types/generalType";
import { createOrUpdateAppOption, deleteDataInStore, getAllPersonnel, getAppOptionData, updateDataInStore } from "../indexedDB/indexedDBService";
import { PlainPersonnel, PlainPersonnelOption } from "@/lib/types/meta";

export class Personnel implements PlainPersonnel {
    id: number;
    slug: string;
    name: string;
    options?: PlainPersonnelOption[];
    isActive?: boolean

    constructor({ id, name, slug, options }: PlainPersonnel) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.options = options;
    }
    convertToSchema() {
        let _personnelSchema: PersonnelSchema = { id: this.id, slug: this.slug, name: this.name, options: this.options }
        return _personnelSchema;
    }

    static async getAllPersonnel() {
        try {
            const _personnelSchemas: PersonnelSchema[] = await getAllPersonnel();
            const _personnel: Personnel[] = _personnelSchemas.map((_personnelSchema) => Personnel.convertPersonnelSchemaToPersonnel(_personnelSchema));
            return _personnel
        } catch (e) {
        }
        return [] as Personnel[]
    }

    static convertPersonnelSchemaToPersonnel(personnelFromSchema: PersonnelSchema): Personnel {
        if (personnelFromSchema.id) {
            return new Personnel({
                id: personnelFromSchema.id,
                name: personnelFromSchema.name,
                slug: personnelFromSchema.slug,
                options: personnelFromSchema.options as PlainPersonnelOption[]
            });
        }
        throw Error // no id, then no personnel
    }

    static async getActivePersonnel() {
        const _activePersonnelOption: AppOptionInterface = await getAppOptionData(StorageLabel.activePersonnel);
        if (_activePersonnelOption) {
            return new Personnel(_activePersonnelOption.value as PlainPersonnel)
        }
        throw new Error("Active Personnel Not Found")
    }

    static async saveActivePersonnel(personnel: Personnel) {
        const _personnel: PlainPersonnel = JSON.parse(JSON.stringify(personnel));
        await createOrUpdateAppOption(StorageLabel.activePersonnel, _personnel);
        return personnel
    }

    static async deletePersonnel(personnel: Personnel | number) {
        let _personnelId: number = (typeof personnel === 'number') ? personnel : personnel.id;
        await deleteDataInStore(_personnelId, StoreName.personnel)
    }

    static async updatePersonnel(personnel: Personnel) {
        await updateDataInStore(personnel, personnel.id, StoreName.personnel)
    }
}
