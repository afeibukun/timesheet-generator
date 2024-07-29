export type TimesheetEntry = {
    id: number,
    day: string,
    date: string,
    startTime: string,
    finishTime: string,
    totalHours: number,
    locationType: string,
    comment: string
}

export type SiteInformation = {
    siteName: string,
    siteCountry: string
}

export type CustomerInformation = {
    customerName: string
}

export type ProjectInformation = {
    purchaseOrderNumber: string,
    orderNumber: string | null
}

export type MobilizationDateInformation = {
    mobilizationDate: string,
    demobilizationDate: string
}

export type TimesheetMetaData = {
    fsrName: string,
    mobilizationDate: string,
    demobilizationDate: string
    customerName: string,
    siteName: string,
    siteCountry: string
    purchaseOrderNumber: string,
    orderNumber: string | null
}

export type DefaultTimesheetInformation = {
    startTime: string,
    finishTime: string,
    locationType: string,
    comment: string,
    weekStartDay: string,
    updatedAt: string,
}