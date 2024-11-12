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

export enum FormState {
    default = "default",
    loading = "loading",
    completed = "completed",
    error = "error", // also completed, but with error
    success = "success", // successfully completed
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
    customer = "customer",
    internal = "internal"
}

export enum TemplateType {
    classic = "classic",
}

export enum OptionLabel {
    mobilizationDate = "mobilization-date",
    demobilizationDate = "demobilization-date",
    timesheetWeek = "timesheet-week",
    timesheetCollectionKey = "timesheet-collection-key",
    costCenter = "cost-center",
    personnelCodeA = "personnel-code-a",
    personnelCodeB = "personnel-code-b",
    approverManager = "approver-manager",
    excludeEntryFromReport = "exclude-entry-from-report",
    isColaRequired = "is-cola-required",
    isPublicHoliday = "is-public-holiday",
    teamLeadName = "team-lead-name"
}

export enum TimesheetEntryType {
    travelMobilization = "travel-mobilization",
    travelDemobilization = "travel-demobilization",
    workingTime = "working-time",
    waitingTime = "waiting-time",
    travelTimeToOrFromSite = "travel-time-to-or-from-site",
}

export enum DateDisplayExportOption {
    showAllDatesInTimesheet = "show-all-dates-in-week",
    hideDatesWithoutTimesheetRecordButRetainSlot = "hide-the-dates-retain-slot-if-no-entry-for-date",
    showOnlyDatesWithEntry = "show-only-dates-with-entry",
}
export type DateDisplayExportOptionKey = "showAllDatesInTimesheet" | "hideDatesWithoutTimesheetRecordButRetainSlot" | "showOnlyDatesWithEntry"

export enum EntryTypeExportOption {
    includeTravelTimeInReport = "include-only-travel-time-in-report",
    includeWaitingTimeInReport = "include-only-waiting-time-in-report",
    includeTravelAndWaitingTimeInReport = "include-travel-and-waiting-time-in-report",
    showOnlyWorkingTime = "default"
}
export type EntryTypeExportOptionKey = "includeTravelTimeInReport" | "includeWaitingTimeInReport" | "includeTravelAndWaitingTimeInReport" | "showOnlyWorkingTime" 
