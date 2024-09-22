import { PersonnelInterface } from "../types/personnelType";

export class Personnel implements PersonnelInterface {
    id: number;
    slug: string;
    name: string;
    isActive?: boolean

    constructor({ id, name, slug }: PersonnelInterface) {
        this.id = id;
        this.name = name;
        this.slug = slug;
    }
}
