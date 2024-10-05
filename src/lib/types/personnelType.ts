export interface PersonnelInterface {
    id: number,
    slug: string,
    name: string,
    options?: PersonnelOptionInterface[],
}

export interface PersonnelOptionInterface {
    id: number,
    key: string,
    value: string,
}