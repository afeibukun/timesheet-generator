import { TimesheetDate } from "./timesheetDate";

export type TimesheetMetaPrimitive = {
    fsrName: string,
    mobilizationDate: string,
    demobilizationDate: string,
    customerName: string,
    siteName: string,
    siteCountry: string,
    purchaseOrderNumber: string,
    orderNumber: string | null
}

interface TimesheetMetaInterface {
    id: number | null,
    fsrName: string,
    mobilizationDate: TimesheetDate,
    demobilizationDate: TimesheetDate,
    customerName: string,
    siteName: string,
    siteCountry: string,
    purchaseOrderNumber: string,
    orderNumber: string | null
}

export class TimesheetMeta implements TimesheetMetaInterface {
    id: number | null;
    fsrName: string;
    mobilizationDate: TimesheetDate;
    demobilizationDate: TimesheetDate;
    customerName: string;
    siteName: string;
    siteCountry: string;
    purchaseOrderNumber: string;
    orderNumber: string | null;

    constructor(metaInput: TimesheetMetaInterface | TimesheetMeta) {
        this.id = metaInput.id;
        this.fsrName = metaInput.fsrName;
        this.mobilizationDate = metaInput.mobilizationDate;
        this.demobilizationDate = metaInput.demobilizationDate;
        this.customerName = metaInput.customerName;
        this.siteName = metaInput.siteName;
        this.siteCountry = metaInput.siteCountry;
        this.purchaseOrderNumber = metaInput.purchaseOrderNumber;
        this.orderNumber = metaInput.orderNumber;
    }

    static refreshTimesheetMeta(parsedTimesheetMetaObject: any) {
        //Timesheet Meta from the local storage does not have access to the functions.
        let parsedTimesheetMeta: TimesheetMeta = new TimesheetMeta({ ...parsedTimesheetMetaObject, mobilizationDate: new TimesheetDate(parsedTimesheetMetaObject.mobilizationDate), demobilizationDate: new TimesheetDate(parsedTimesheetMetaObject.demobilizationDate) });
        return parsedTimesheetMeta;
    }

    convertToTimesheetMetaFormData(): TimesheetMetaPrimitive {
        const timesheetMetaFormData: TimesheetMetaPrimitive = {
            ...this,
            mobilizationDate: this.mobilizationDate.dateInputNaturalFormat(),
            demobilizationDate: this.demobilizationDate.dateInputNaturalFormat(),
        }
        return timesheetMetaFormData;
    }

    static createTimesheetMetaFromTimesheetMetaFormData(timesheetMetaFormData: TimesheetMetaPrimitive): TimesheetMeta {
        const timesheetMeta: TimesheetMeta = new TimesheetMeta({
            ...timesheetMetaFormData,
            mobilizationDate: new TimesheetDate({ dateInput: timesheetMetaFormData.mobilizationDate }),
            demobilizationDate: new TimesheetDate({ dateInput: timesheetMetaFormData.demobilizationDate }),
        } as TimesheetMetaInterface);
        return timesheetMeta;
    }
}
