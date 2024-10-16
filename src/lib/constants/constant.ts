export enum ComponentType {
    timesheet = "timesheet",
    timesheetCollection = "collection"
}

export enum Status {
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
    hideForm = "HIDE_FORM",
    start = "START"
}

export enum LocationType {
    onshore = "onshore",
    offshore = "offshore"
}

export enum PeriodTypeLabel {
    start = "start",
    finish = "finish"
}

export enum EntryStateLabel {
    default = "DEFAULT",
    edit = "EDIT",
    recentlyUpdated = "RECENTLY_UPDATED"
}

export enum ErrorMessage {
    entryOnDateNotFound = "entry-on-date-not-found-in-timesheet",
    invalidTimesheet = "invalid-timesheet",
    projectNotFound = "project-information-not-found",
    invalidStartTime = "invalid-start-time",
    invalidFinishTime = "invalid-finish-time",
    customerNotFound = "customer-information-not-found",
    customerSitesNotFound = "sites-not-found-for-selected-customer",
    siteNotValid = "selected-site-not-valid",
    timesheetEntriesNotFound = "entries-not-found",
    timesheetNotFound = "timesheet-not-found",
    dateSelectionMismatch = "start-date-is-after-finish-date",
    defaultDataNotFound = "default-data-not-found",
    startTimeNotFound = "start-time-not-found",
    finishTimeNotFound = "finish-time-not-found",
    timeNotDefined = "time-not-defined",
    wrongTimeOrder = "time-order-is-wrong",
    wrongBreakStartAndStartTimeOrder = "wrong-break-start-and-start-time-order",
    wrongBreakTimeOrder = "wrong-break-time-order",
    timeInputNotFound = "time-input-not-found",
    timeInvalid = "time-invalid"
}

export enum ToastStatus {
    success = "success",
    danger = "danger",
    info = "info"
}

export enum SettingSection {
    default = "default",
    personnel = "personnel",
    project = "project",
    customer = "customer"
}

export enum SearchParamsLabel {
    component = "component",
    section = "section",
    key = "key"
}

export enum ReportType {
    customer = "customer-timesheet",
    internal = "internal-timesheet"
}

export enum TemplateType {
    classic = "classic-timesheet",
}

export enum OptionLabel {
    mobilizationDate = "mobilization-date",
    demobilizationDate = "demobilization-date",
    timesheetWeek = "timesheet-week",
    timesheetCollectionKey = "timesheet-collection-key"
}

export enum TimesheetEntryType {
    travelMobilization = "travel-mobilization",
    travelDemobilization = "travel-demobilization",
    workingTime = "working-time",
    waitingTime = "waiting-time",
    publicHolidayWork = "public-holiday-work",
    travelTimeToSite = "travel-time-to-site",
    travelTimeFromSite = "travel-time-from-site",
}
