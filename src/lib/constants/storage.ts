export enum StorageLabel {
    timesheetEntryDefaultDataLabel = "TIMESHEET_ENTRY_DEFAULT_DATA",
    activeTimesheetCollectionIdLabel = "ACTIVE_TIMESHEET_COLLECTION_ID",
    activeTimesheetIdLabel = "ACTIVE_TIMESHEET_ID",
    activeComponentType = "ACTIVE_COMPONENT_TYPE", // the value here tells us if a timesheet collection is the active component or the regular timesheet, I might not need this later sha.
    activePersonnel = "ACTIVE_PERSONNEL",
    timesheetDefaultInformationLabel = "DEFAULT_TIMESHEET_INFORMATION",
    currentTimesheetMetaLabel = "CURRENT_TIMESHEET_META",
    generatedTimesheetLabel = "GENERATED_TIMESHEET",
    personnelCollectionLabel = "PERSONNEL_COLLECTION",
}

export const timesheetDatabaseName = "timesheet_database";

export enum StoreName {
    personnel = "personnel",
    timesheet = "timesheet",
    timesheetCollection = "timesheet_collection",
    customer = "customer",
    project = "project",
    appOption = "app_option"
}

export enum IndexName {
    slugIndex = "slug_index",
    nameIndex = "name_index",
    personnelSlugIndex = "personnelSlug_index",
    weekEndingDateIndex = "weekEndDate_index",
    purchaseOrderNumberIndex = "purchaseOrderNumber_index",
    keyIndex = "key_index"
}

export enum FieldName {
    id = "id",
    slug = "slug",
    name = "name",
    personnel = "personnel",
    personnelSlug = "personnelSlug",
    weekEndingDate = "weekEndingDate",
    weekEndingDateString = "weekEndingDateString",
    purchaseOrderNumber = "purchaseOrderNumber",
    key = "key"
}
