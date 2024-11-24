import { StorageLabel, StoreName } from "../../constants/storage";
import { AppOptionInterface } from "../../types/generalType";
import { createOrUpdateAppOption, deleteDataInStore, getAllPersonnel, getAppOptionData, updateDataInStore } from "../indexedDB/indexedDBService";
import { PlainPersonnel, PersonnelOption } from "@/lib/types/meta";

export class Personnel implements PlainPersonnel {
    id: number;
    slug: string;
    name: string;
    options: PersonnelOption[];
    isActive?: boolean

    constructor({ id, name, slug, options }: PlainPersonnel) {
        if (!id) throw new Error("Invalid Personnel")
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.options = options;
    }
    convertToPlain() {
        let _plainPersonnel: PlainPersonnel = { id: this.id, slug: this.slug, name: this.name, options: this.options }
        return _plainPersonnel;
    }

    static async getAllPersonnel() {
        try {
            const _plainPersonnels: PlainPersonnel[] = await getAllPersonnel();
            const _personnel: Personnel[] = _plainPersonnels.map((_plainPersonnel) => new Personnel(_plainPersonnel));
            return _personnel
        } catch (e) {
        }
        return [] as Personnel[]
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
