import { TimesheetDate } from "./timesheetDate";

export type TimesheetMetaForForms = {
    id: number | null,
    personnelName: string,
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
    personnelName: string,
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
    personnelName: string;
    mobilizationDate: TimesheetDate;
    demobilizationDate: TimesheetDate;
    customerName: string;
    siteName: string;
    siteCountry: string;
    purchaseOrderNumber: string;
    orderNumber: string | null;

    constructor(metaInput: TimesheetMetaInterface | TimesheetMeta) {
        this.id = metaInput.id;
        this.personnelName = metaInput.personnelName;
        this.mobilizationDate = metaInput.mobilizationDate;
        this.demobilizationDate = metaInput.demobilizationDate;
        this.customerName = metaInput.customerName;
        this.siteName = metaInput.siteName;
        this.siteCountry = metaInput.siteCountry;
        this.purchaseOrderNumber = metaInput.purchaseOrderNumber;
        this.orderNumber = metaInput.orderNumber;
    }

    static createTimesheetMetaFromTimesheetMetaForForms(timesheetMetaForForms: TimesheetMetaForForms): TimesheetMeta {
        let timesheetMeta: TimesheetMeta = new TimesheetMeta({ ...timesheetMetaForForms, mobilizationDate: new TimesheetDate({ dateInput: timesheetMetaForForms.mobilizationDate }), demobilizationDate: new TimesheetDate({ dateInput: timesheetMetaForForms.demobilizationDate }) });
        return timesheetMeta;
    }

    convertToTimesheetMetaForForms(): TimesheetMetaForForms {
        const timesheetMetaForForms: TimesheetMetaForForms = {
            ...this,
            mobilizationDate: this.mobilizationDate.dateInputNaturalFormat(),
            demobilizationDate: this.demobilizationDate.dateInputNaturalFormat(),
        }
        return timesheetMetaForForms;
    }

    isMobilizationPeriodChanged(timesheetMetaForForm: TimesheetMetaForForms): Boolean {
        const updatedTimesheetMeta = TimesheetMeta.createTimesheetMetaFromTimesheetMetaForForms(timesheetMetaForForm);
        if (!(this.mobilizationDate.isDateSame(updatedTimesheetMeta.mobilizationDate) && this.demobilizationDate.isDateSame(updatedTimesheetMeta.demobilizationDate))) {
            return true;
        }
        return false;

    }

    isMinorDataChanged(timesheetMetaForForm: TimesheetMetaForForms): Boolean {
        const updatedTimesheetMeta = TimesheetMeta.createTimesheetMetaFromTimesheetMetaForForms(timesheetMetaForForm);
        if (this.personnelName != updatedTimesheetMeta.personnelName || this.customerName != updatedTimesheetMeta.customerName || this.siteName != updatedTimesheetMeta.siteName || this.siteCountry != updatedTimesheetMeta.siteCountry || this.purchaseOrderNumber != updatedTimesheetMeta.purchaseOrderNumber || this.orderNumber != updatedTimesheetMeta.orderNumber) {
            return true;
        }
        return false;
    }

    isMinorDataOnlyChanged(timesheetMetaForForm: TimesheetMetaForForms): Boolean {
        if (this.isMinorDataChanged(timesheetMetaForForm) && !this.isMobilizationPeriodChanged(timesheetMetaForForm)) return true;
        return false;
    }

    isAnyDataChanged(timesheetMetaForForm: TimesheetMetaForForms): Boolean {
        if (this.isMinorDataChanged(timesheetMetaForForm) || this.isMobilizationPeriodChanged(timesheetMetaForForm)) return true;
        return false;
    }


    static createTimesheetMetaFromTimesheetMetaForForms_duplicate(timesheetMetaFormData: TimesheetMetaForForms): TimesheetMeta {
        const timesheetMeta: TimesheetMeta = new TimesheetMeta({
            ...timesheetMetaFormData,
            mobilizationDate: new TimesheetDate({ dateInput: timesheetMetaFormData.mobilizationDate }),
            demobilizationDate: new TimesheetDate({ dateInput: timesheetMetaFormData.demobilizationDate }),
        } as TimesheetMetaInterface);
        return timesheetMeta;
    }
}
