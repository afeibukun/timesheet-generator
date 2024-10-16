
// PERSONNEL
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

// SITE
export interface SiteInterface {
    id?: number,
    slug: string,
    name: string,
    description?: string,
    country: string
}

// CUSTOMER
export interface CustomerInterface {
    id: number,
    slug: string,
    name: string,
}

// PROJECT
export interface ProjectInterface {
    id?: number
    purchaseOrderNumber: string,
    orderNumber?: string
}