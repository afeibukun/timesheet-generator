import { TimesheetDate } from "./timesheetDate";

export type TimesheetMetaFormData = {
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

    constructor({ id, fsrName, mobilizationDate, demobilizationDate, customerName, siteName, siteCountry, purchaseOrderNumber, orderNumber }: any) {
        this.id = id;
        this.fsrName = fsrName;
        this.mobilizationDate = mobilizationDate;
        this.demobilizationDate = demobilizationDate;
        this.customerName = customerName;
        this.siteName = siteName;
        this.siteCountry = siteCountry;
        this.purchaseOrderNumber = purchaseOrderNumber;
        this.orderNumber = orderNumber;
    }

    static refreshTimesheetMeta(parsedTimesheetMetaObject: any) {
        //Timesheet Meta from the local storage does not have access to the functions.
        let parsedTimesheetMeta: TimesheetMeta = new TimesheetMeta({ ...parsedTimesheetMetaObject, mobilizationDate: new TimesheetDate(parsedTimesheetMetaObject.mobilizationDate), demobilizationDate: new TimesheetDate(parsedTimesheetMetaObject.demobilizationDate) });
        return parsedTimesheetMeta;
    }

    convertToTimesheetMetaFormData(): TimesheetMetaFormData {
        const timesheetMetaFormData: TimesheetMetaFormData = {
            ...this,
            mobilizationDate: this.mobilizationDate.dateInputNaturalFormat(),
            demobilizationDate: this.demobilizationDate.dateInputNaturalFormat(),
        }
        return timesheetMetaFormData;
    }

    static createTimesheetMetaFromTimesheetMetaFormData(timesheetMetaFormData: TimesheetMetaFormData): TimesheetMeta {
        const timesheetMeta: TimesheetMeta = new TimesheetMeta({
            ...timesheetMetaFormData,
            mobilizationDate: new TimesheetDate(timesheetMetaFormData.mobilizationDate),
            demobilizationDate: new TimesheetDate(timesheetMetaFormData.demobilizationDate),
        });
        return timesheetMeta;
    }

}
