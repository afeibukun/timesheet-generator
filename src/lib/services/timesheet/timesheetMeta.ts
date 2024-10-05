import { PrimitiveTimesheetMetaInterface, TimesheetMetaInterface } from "@/lib/types/timesheetType";
import { TimesheetDate } from "./timesheetDate";

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

    constructor(metaInput: TimesheetMetaInterface) {
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

    static createTimesheetMetaFromPrimitiveTimesheetMeta(primitiveTimesheetMeta: PrimitiveTimesheetMetaInterface): TimesheetMeta {
        let timesheetMeta: TimesheetMeta = new TimesheetMeta({ ...primitiveTimesheetMeta, mobilizationDate: new TimesheetDate({ date: primitiveTimesheetMeta.mobilizationDate }), demobilizationDate: new TimesheetDate({ date: primitiveTimesheetMeta.demobilizationDate }) });
        return timesheetMeta;
    }

    convertToPrimitiveTimesheetMeta(): PrimitiveTimesheetMetaInterface {
        const primitiveTimesheetMeta: PrimitiveTimesheetMetaInterface = {
            ...this,
            mobilizationDate: this.mobilizationDate.dateInputNaturalFormat(),
            demobilizationDate: this.demobilizationDate.dateInputNaturalFormat(),
        }
        return primitiveTimesheetMeta;
    }

    isMobilizationPeriodChanged(primitiveTimesheetMeta: PrimitiveTimesheetMetaInterface): Boolean {
        const updatedTimesheetMeta = TimesheetMeta.createTimesheetMetaFromPrimitiveTimesheetMeta(primitiveTimesheetMeta);
        if (!(this.mobilizationDate.isDateSame(updatedTimesheetMeta.mobilizationDate) && this.demobilizationDate.isDateSame(updatedTimesheetMeta.demobilizationDate))) {
            return true;
        }
        return false;

    }

    isMinorDataChanged(primitiveTimesheetMeta: PrimitiveTimesheetMetaInterface): Boolean {
        const updatedTimesheetMeta = TimesheetMeta.createTimesheetMetaFromPrimitiveTimesheetMeta(primitiveTimesheetMeta);
        if (this.personnelName != updatedTimesheetMeta.personnelName || this.customerName != updatedTimesheetMeta.customerName || this.siteName != updatedTimesheetMeta.siteName || this.siteCountry != updatedTimesheetMeta.siteCountry || this.purchaseOrderNumber != updatedTimesheetMeta.purchaseOrderNumber || this.orderNumber != updatedTimesheetMeta.orderNumber) {
            return true;
        }
        return false;
    }

    isMinorDataOnlyChanged(primitiveTimesheetMeta: PrimitiveTimesheetMetaInterface): Boolean {
        if (this.isMinorDataChanged(primitiveTimesheetMeta) && !this.isMobilizationPeriodChanged(primitiveTimesheetMeta)) return true;
        return false;
    }

    isAnyDataChanged(primitiveTimesheetMeta: PrimitiveTimesheetMetaInterface): Boolean {
        if (this.isMinorDataChanged(primitiveTimesheetMeta) || this.isMobilizationPeriodChanged(primitiveTimesheetMeta)) return true;
        return false;
    }

    static createTimesheetMetaFromTimesheetMetaForForms_duplicate(primitiveTimesheetMeta: PrimitiveTimesheetMetaInterface): TimesheetMeta {
        const timesheetMeta: TimesheetMeta = new TimesheetMeta({
            ...primitiveTimesheetMeta,
            mobilizationDate: new TimesheetDate({ date: primitiveTimesheetMeta.mobilizationDate }),
            demobilizationDate: new TimesheetDate({ date: primitiveTimesheetMeta.demobilizationDate }),
        } as TimesheetMetaInterface);
        return timesheetMeta;
    }
}
