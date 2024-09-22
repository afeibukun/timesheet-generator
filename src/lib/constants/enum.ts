export enum LocalStorageLabelEnum {
    timesheetDefaultInformationLabel = "DEFAULT_TIMESHEET_INFORMATION",
    currentTimesheetMetaLabel = "CURRENT_TIMESHEET_META",
    generatedTimesheetLabel = "GENERATED_TIMESHEET",
    personnelCollectionLabel = "PERSONNEL_COLLECTION",
}

export enum storageOptionLabel {
    timesheetEntryDefaultDataLabel = "TIMESHEET_ENTRY_DEFAULT_DATA",
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