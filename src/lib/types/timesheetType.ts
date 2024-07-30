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