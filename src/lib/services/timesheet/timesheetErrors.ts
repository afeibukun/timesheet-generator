export class InvalidTimesheetDateError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    cause?: unknown;

    constructor(message: string) {
        this.name = "InvalidTimesheetDateError";
        this.message = message
    }
}

export class CannotParsePrimitiveDataToDefaultTimesheetInformationError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    cause?: unknown;

    constructor(message: string) {
        this.name = "CannotParsePrimitiveDataToDefaultTimesheetInformationError";
        this.message = message
    }
}

export class CannotParsePrimitiveDataToTimesheetError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    cause?: unknown;

    constructor(message: string) {
        this.name = "CannotParsePrimitiveDataToTimesheetError";
        this.message = message
    }
}