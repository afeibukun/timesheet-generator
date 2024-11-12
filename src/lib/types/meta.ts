
// PERSONNEL
export interface PlainPersonnel {
    id: number,
    slug: string,
    name: string,
    options?: PlainPersonnelOption[],
}

export interface PlainPersonnelOption {
    id?: number,
    key: string,
    value: string,
}

// SITE
export interface PlainSite {
    id?: number,
    slug: string,
    name: string,
    description?: string,
    country: string
}

// CUSTOMER
export interface PlainCustomer {
    id: number,
    slug: string,
    name: string,
}

// PROJECT
export interface PlainProject {
    id?: number
    purchaseOrderNumber: string,
    orderNumber?: string,
    description?: string
}