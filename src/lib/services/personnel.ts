import { PersonnelSchema } from "../constants/schema";
import { PersonnelInterface, PersonnelOptionInterface } from "../types/personnelType";

export class Personnel implements PersonnelInterface {
    id: number;
    slug: string;
    name: string;
    options?: PersonnelOptionInterface[];
    isActive?: boolean

    constructor({ id, name, slug, options }: PersonnelInterface) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.options = options;
    }

    static convertPersonnelSchemaToPersonnel(personnelFromSchema: PersonnelSchema): Personnel {
        if (personnelFromSchema.id) {
            return new Personnel({
                id: personnelFromSchema.id,
                name: personnelFromSchema.name,
                slug: personnelFromSchema.slug,
                options: personnelFromSchema.options as PersonnelOptionInterface[]
            });
        }
        throw Error // no id, then no personnel
    }
}
