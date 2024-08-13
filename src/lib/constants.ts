export enum LocalStorageLabel {
    timesheetDefaultInformationLabel = "DEFAULT_TIMESHEET_INFORMATION",
    currentTimesheetMetaLabel = "CURRENT_TIMESHEET_META",
    generatedTimesheetLabel = "GENERATED_TIMESHEET",
}


export enum StatusConstants {
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
}

export const timesheetDefaultInformationConstant = {
    startTime: '06:00',
    finishTime: '18:00',
    locationType: 'onshore',
    comment: 'Productive Work at the Office',
    weekStartDay: "monday",
    updatedAt: ''
}

export enum EntryStateConstants {
    default = "DEFAULT",
    edit = "EDIT",
    recentlyUpdated = "RECENTLY_UPDATED"
}