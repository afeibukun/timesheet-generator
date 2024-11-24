import { PlainProject } from "@/lib/types/meta";
import { getAllProjects, getInStore } from "../indexedDB/indexedDBService";
import { StoreName } from "@/lib/constants/storage";

export class Project implements PlainProject {
    id: number;
    purchaseOrderNumber: string;
    orderNumber?: string | undefined;
    description?: string | undefined;

    constructor({ id, purchaseOrderNumber, orderNumber, description }: PlainProject) {
        if (!id) throw new Error("Cannot Initialize Project");
        this.id = id;
        this.purchaseOrderNumber = purchaseOrderNumber;
        this.orderNumber = orderNumber;
        this.description = description;
    }

    convertToPlain() {
        return { id: this.id, purchaseOrderNumber: this.purchaseOrderNumber, orderNumber: this.orderNumber } as PlainProject
    }

    static async getAllProjects() {
        try {
            let _plainProject: PlainProject[] = await getAllProjects();
            const _projects = _plainProject.map((_plainProject) => new Project(_plainProject))
            return _projects;
        } catch (e) { }
        return [] as Project[]
    }

    static async getProjectById(id: number) {
        const _plainProject: PlainProject = await getInStore(id, StoreName.project);
        const _project = new Project(_plainProject);
        return _project;
    }
}
