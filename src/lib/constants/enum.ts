export enum LocalStorageLabelEnum {
    timesheetDefaultInformationLabel = "DEFAULT_TIMESHEET_INFORMATION",
    currentTimesheetMetaLabel = "CURRENT_TIMESHEET_META",
    generatedTimesheetLabel = "GENERATED_TIMESHEET",
    personnelCollectionLabel = "PERSONNEL_COLLECTION",
}

export enum StorageOptionLabel {
    timesheetEntryDefaultDataLabel = "TIMESHEET_ENTRY_DEFAULT_DATA",
    activeTimesheetCollectionIdLabel = "ACTIVE_TIMESHEET_COLLECTION_ID",
    activeTimesheetIdLabel = "ACTIVE_TIMESHEET_ID",
    activeComponentType = "ACTIVE_COMPONENT_TYPE" // the value here tells us if a timesheet collection is the active component or the regular timesheet, I might not need this later sha.
}

export enum ActiveComponentType {
    timesheet = "TIMESHEET",
    timesheetCollection = "TIMESHEET_COLLECTION"
}

export enum StatusEnum {
    enteringData = "ENTERING_DATA",
    inProgress = "IN_PROGRESS",
    pending = "PENDING",
    submitting = "SUBMITTING",
    submitted = "SUBMITTED",
    created = "CREATED",
    accepted = "ACCEPTED",
    success = "SUCCESS",
    updating = "UPDATING",
    failed = "FAILED",
    visible = "VISIBLE",
    hidden = "HIDDEN",
    new = "NEW",
    default = "DEFAULT",
    displayForm = "DISPLAY_FORM",
    hideForm = "HIDE_FORM"
}

export enum LocationTypeEnum {
    onshore = "onshore",
    offshore = "offshore"
}

export enum PeriodTypeEnum {
    start = "start",
    finish = "finish"
}

export enum EntryStateEnum {
    default = "DEFAULT",
    edit = "EDIT",
    recentlyUpdated = "RECENTLY_UPDATED"
}