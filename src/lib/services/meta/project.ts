import { ProjectInterface, SiteInterface } from "@/lib/types/meta";
import { ProjectSchema } from "@/lib/types/schema";
import { getAllProjects, getInStore } from "../indexedDB/indexedDBService";
import { StoreName } from "@/lib/constants/storage";

export class Project implements ProjectInterface {
    id: number;
    purchaseOrderNumber: string;
    orderNumber?: string | undefined;

    constructor({ id, purchaseOrderNumber, orderNumber }: ProjectInterface) {
        if (!id) throw new Error("Cannot Initialize Project");
        this.id = id;
        this.purchaseOrderNumber = purchaseOrderNumber;
        this.orderNumber = orderNumber;
    }

    static convertSchemaToProject(projectSchemaObject: ProjectSchema) {
        if (projectSchemaObject.id) {
            const _project: Project = new Project({ id: projectSchemaObject.id, purchaseOrderNumber: projectSchemaObject.purchaseOrderNumber, orderNumber: projectSchemaObject.orderNumber });
            return _project
        }
        throw new Error('Project Schema Cannot Be Converted To Project Object');
    }

    static async getAllProjects() {
        try {
            let _projectSchemas: ProjectSchema[] = await getAllProjects();
            const _projects = _projectSchemas.map((_projectSchema) => Project.convertSchemaToProject(_projectSchema))
            return _projects;
        } catch (e) { }
        return [] as Project[]
    }

    static async getProjectById(id: number) {
        const _projectSchema: ProjectSchema = await getInStore(id, StoreName.project);
        const _project = Project.convertSchemaToProject(_projectSchema);
        return _project;
    }
}
