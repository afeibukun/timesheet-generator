import { TimesheetDate } from "./timesheetDate";

export type TimesheetMetaPrimitive = {
    id: number | null,
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

    static createTimesheetMetaFromPrimitive(primitiveTimesheetMeta: TimesheetMetaPrimitive) {
        let timesheetMeta: TimesheetMeta = new TimesheetMeta({ ...primitiveTimesheetMeta, mobilizationDate: new TimesheetDate({ dateInput: primitiveTimesheetMeta.mobilizationDate }), demobilizationDate: new TimesheetDate({ dateInput: primitiveTimesheetMeta.demobilizationDate }) });
        return timesheetMeta;
    }


    convertToPrimitiveTimesheetMeta(): TimesheetMetaPrimitive {
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
