import { OptionLabel } from "../constants/constant"
import { StorageLabel } from "../constants/storage"

// PERSONNEL
export interface PlainPersonnel {
    id?: number,
    slug: string,
    name: string,
    options: PersonnelOption[],
}

export interface PersonnelOption {
    id?: number,
    key: PersonnelOptionKey,
    value: string,
}

export type PersonnelOptionKey = OptionLabel.personnelCodeA | OptionLabel.personnelCodeB | OptionLabel.costCenter | OptionLabel.approverManager

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
    id?: number,
    slug: string,
    name: string,
    activeSite?: PlainSite, //not to be saved in db
    sites?: PlainSite[] // for use in db and when creating sites / customers
}

// PROJECT
export interface PlainProject {
    id?: number
    purchaseOrderNumber: string,
    orderNumber?: string,
    description?: string
}

export interface PlainAppOption {
    id?: number
    key: AppOptionKey,
    value: any,
}

export type AppOptionKey = StorageLabel.exportOptionLabel | StorageLabel.activePersonnel | StorageLabel.activeTimesheetIdLabel | StorageLabel.activeComponentType | StorageLabel.activeTimesheetCollectionIdLabel | StorageLabel.activeComponentType