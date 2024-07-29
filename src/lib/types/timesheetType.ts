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

export type DefaultTimesheetInformation = {
    startTime: string,
    finishTime: string,
    locationType: string,
    comment: string,
    weekStartDay: string,
    updatedAt: string,
}