'use client'
import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import DefaultFormItem from "../_components/DefaultFormItem";
import DefaultLabelText from "../_components/DefaultLabelText";
import DefaultFormGroupTitle from "../_components/DefaultFormGroupTitle";
import DefaultFormGroup from "../_components/DefaultFormGroup";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";
import { useEffect, useState } from "react";
import { StatusEnum } from "@/lib/constants/enum";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { TimesheetMeta } from "@/lib/services/timesheet/timesheetMeta";
import { useRouter } from "next/navigation";
import { TimesheetLocalStorage } from "@/lib/services/timesheet/timesheetLocalStorage";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import moment from "moment";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { DefaultPrimitiveTimesheetEntryDataInterface, PrimitiveTimesheetMetaInterface } from "@/lib/types/timesheetType";
import { initialTimesheetMeta } from "@/lib/constants/defaultData";

export default function Generate() {
    const router = useRouter();

    const _initialTimesheetMeta: PrimitiveTimesheetMetaInterface = initialTimesheetMeta;

    const timesheetDefaultData: DefaultPrimitiveTimesheetEntryDataInterface = Timesheet.defaultInformation();
    const hasUpdatedDefaultInformation = Timesheet.hasUpdatedDefaultInformation();
    const [timesheetDefaultViewStatus, setTimesheetDefaultViewStatus] = useState(StatusEnum.hidden);

    const [primitiveTimesheetMeta, setPrimitiveTimesheetMeta] = useState(_initialTimesheetMeta);
    const [timesheet, setTimesheet] = useState(null as Timesheet | null);

    const [status, setStatus] = useState(StatusEnum.enteringData);
    const [viewState, setViewState] = useState(StatusEnum.new);


    useEffect(() => {
        var retrievedTimesheet
        try {
            retrievedTimesheet = TimesheetLocalStorage.getTimesheetFromLocalStorage();
            setTimesheet(retrievedTimesheet);
        } catch (e) { }

        if (retrievedTimesheet != undefined) {
            const _primitiveTimesheetMeta = retrievedTimesheet.meta.convertToPrimitiveTimesheetMeta();
            setPrimitiveTimesheetMeta(_primitiveTimesheetMeta);
            setViewState(StatusEnum.updating);
        }
    }, []);

    function handleInputChange(e: any, metaKey: string) {
        let metaValue = e.target.value;
        setPrimitiveTimesheetMeta({ ...primitiveTimesheetMeta, [metaKey]: metaValue });
    }

    function handleSubmitTimesheetMeta(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setStatus(StatusEnum.submitting);

        var localTimesheet
        if (Timesheet.isNull(timesheet) || timesheet?.meta.isMobilizationPeriodChanged(primitiveTimesheetMeta)) {
            const timesheetMeta = TimesheetMeta.createTimesheetMetaFromPrimitiveTimesheetMeta(primitiveTimesheetMeta);
            let timesheetEntryCollection = TimesheetEntry.createTimesheetEntryCollection(timesheetMeta.mobilizationDate, timesheetMeta.demobilizationDate);
            localTimesheet = new Timesheet({ meta: timesheetMeta, entryCollection: timesheetEntryCollection });
            TimesheetLocalStorage.setGeneratedTimesheetInLocalStorage(localTimesheet);
        } else if (timesheet?.meta.isMinorDataOnlyChanged(primitiveTimesheetMeta)) {
            const timesheetMeta = TimesheetMeta.createTimesheetMetaFromPrimitiveTimesheetMeta(primitiveTimesheetMeta);
            localTimesheet = new Timesheet({ meta: timesheetMeta, entryCollection: timesheet!.entryCollection });
            TimesheetLocalStorage.setGeneratedTimesheetInLocalStorage(localTimesheet);
        } else { }
        setStatus(StatusEnum.submitted);
        router.push('/preview');
    }
    return (
        <main className="container">
            <DefaultSection>
                <DefaultSectionHeader>
                    <DefaultSectionTitle><span>{viewState == StatusEnum.new ? 'Generate New ' : 'Edit '} Timesheet</span>
                        {viewState == StatusEnum.new ? <span>🆕</span> : <span>✍</span>}
                    </DefaultSectionTitle>
                </DefaultSectionHeader>
                <div className="section-body">
                    <form action="">
                        <div className="form-group">
                            <DefaultFormItem>
                                <label htmlFor="personnelName" >
                                    <DefaultLabelText>Personnel Name</DefaultLabelText>
                                </label>
                                <input type="text"
                                    value={primitiveTimesheetMeta.personnelName}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'personnelName');
                                        }
                                    }
                                    name="personnelName"
                                    id="personnelName"
                                    className="inline-block border rounded" />
                            </DefaultFormItem>
                        </div>
                        <DefaultFormGroup>
                            <DefaultFormGroupTitle>Mobilization Date Information</DefaultFormGroupTitle>
                            <DefaultFormItem>
                                <label htmlFor="mobilizationDate">
                                    <DefaultLabelText>Personnel Mobilization Date</DefaultLabelText>
                                </label>
                                <input type="date"
                                    value={primitiveTimesheetMeta.mobilizationDate}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'mobilizationDate');
                                        }
                                    }
                                    name="mobilizationDate" id="mobilizationDate" className="border rounded" />
                            </DefaultFormItem>
                            <DefaultFormItem>
                                <label htmlFor="demobilizationDate">
                                    <DefaultLabelText>Personnel Demob Date</DefaultLabelText>
                                </label>
                                <input type="date"
                                    name="demobilizationDate"
                                    id="demobilizationDate"
                                    value={primitiveTimesheetMeta.demobilizationDate}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'demobilizationDate');
                                        }
                                    }
                                    className="border rounded" />
                            </DefaultFormItem>
                        </DefaultFormGroup>
                        <DefaultFormGroup>
                            <DefaultFormGroupTitle>Customer Information</DefaultFormGroupTitle>
                            <DefaultFormItem>
                                <label htmlFor="customerName">
                                    <DefaultLabelText>Customer Name
                                    </DefaultLabelText>
                                </label>
                                <input type="text"
                                    name="customerName"
                                    id="customerName"
                                    value={primitiveTimesheetMeta.customerName}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'customerName');
                                        }
                                    }
                                    className="border rounded" />
                            </DefaultFormItem>
                            <DefaultFormItem>
                                <label htmlFor="siteName">
                                    <DefaultLabelText>Site Name</DefaultLabelText>

                                </label>
                                <input type="text"
                                    name="siteName"
                                    id="siteName"
                                    value={primitiveTimesheetMeta.siteName}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'siteName');
                                        }
                                    }
                                    className="border rounded" />
                            </DefaultFormItem>
                            <DefaultFormItem>
                                <label htmlFor="siteCountry">
                                    <DefaultLabelText>Site Country</DefaultLabelText>
                                </label>
                                <input type="text"
                                    name="siteCountry"
                                    id="siteCountry"
                                    value={primitiveTimesheetMeta.siteCountry}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'siteCountry');
                                        }
                                    }
                                    className="border rounded" />
                            </DefaultFormItem>
                        </DefaultFormGroup>

                        <DefaultFormGroup>
                            <DefaultFormGroupTitle>Project Information</DefaultFormGroupTitle>
                            <DefaultFormItem>
                                <label htmlFor="purchaseOrderNumber">
                                    <DefaultLabelText>Purchase Order (PO) Number</DefaultLabelText>
                                </label>
                                <input type="text"
                                    name="purchaseOrderNumber"
                                    id="purchaseOrderNumber"
                                    value={primitiveTimesheetMeta.purchaseOrderNumber}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'purchaseOrderNumber');
                                        }
                                    }
                                    className="border rounded" />
                            </DefaultFormItem>
                            <DefaultFormItem>
                                <label htmlFor="orderNumber">
                                    <DefaultLabelText>Order Number</DefaultLabelText>
                                </label>
                                <input type="text"
                                    name="orderNumber"
                                    id="orderNumber"
                                    value={primitiveTimesheetMeta.orderNumber?.toString()}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'orderNumber');
                                        }
                                    } className="border rounded" />
                            </DefaultFormItem>
                        </DefaultFormGroup>

                        {Timesheet.isNull(timesheet) ?
                            <div className="form-notice-group">
                                <div className="p-3 bg-slate-200 rounded mb-4">
                                    <div className="">
                                        <h4 className="text-lg font-semibold text-slate-800">Timesheet Default Information</h4>
                                        {!hasUpdatedDefaultInformation ?
                                            <p className="text-sm"><b className="inline-block bg-orange-300 px-1 py-0.5 rounded">WARNING:</b> You have not reviewed the Timesheet Default Information recently, Kindly confirm that the default data below is okay to auto populate the timesheet. Otherwise you can edit the Timesheet Default Information <Link href="/default-information" className="text-blue-700 border-dashed border-b border-blue-700 italic">Here!</Link></p>
                                            :
                                            <p className="text-sm"><b className="inline-block bg-blue-300 px-1 py-0.5 rounded">Gentle Reminder:</b> You can review your Timesheet Default Information here, Confirm that the default data below is okay to auto populate the timesheet. If you want edit the Timesheet Default Information, Click <Link href="/default-information" className="text-blue-700 border-dashed border-b border-blue-700 italic">Here!</Link></p>
                                        }
                                        <div>
                                            <button type="button" onClick={() => setTimesheetDefaultViewStatus(timesheetDefaultViewStatus == StatusEnum.visible ? StatusEnum.hidden : StatusEnum.visible)} className="border-dashed border-b border-slate-400 text-xs text-slate-400 italic">[Show {timesheetDefaultViewStatus == StatusEnum.visible ? 'Less' : 'More'}]</button>
                                        </div>
                                    </div>
                                    <div className={timesheetDefaultViewStatus == StatusEnum.visible ? 'h-auto overflow-auto' : 'h-0 overflow-hidden'}>
                                        <div className="mt-4">
                                            <ul>
                                                <li className="pb-1">
                                                    <em className="inline-block w-32 font-medium">Start Time:</em>
                                                    <span className="inline-block py-1 px-2 bg-slate-300 rounded">{timesheetDefaultData.startTime}</span>
                                                </li>
                                                <li className="pb-1">
                                                    <em className="inline-block w-32 font-medium">Finish Time:</em>
                                                    <span className="inline-block py-1 px-2 bg-slate-300 rounded">{timesheetDefaultData.finishTime}</span>
                                                </li>
                                                <li className="pb-1">
                                                    <em className="inline-block w-32 font-medium">Location Type:</em>
                                                    <span className="inline-block py-1 px-2 bg-slate-300 rounded">{timesheetDefaultData.locationType}</span>
                                                </li>
                                                <li className="pb-1">
                                                    <em className="inline-block w-32 font-medium">Comment:</em>
                                                    <span className="inline-block py-1 px-2 bg-slate-300 rounded">{timesheetDefaultData.comment}</span>
                                                </li>
                                                <li className="pb-1">
                                                    <em className="inline-block w-32 font-medium">Week Start Day:</em>
                                                    <span className="inline-block py-1 px-2 bg-slate-300 rounded">{timesheetDefaultData.weekStartDay}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mb-4">
                                            <Link href="/default-information" className="text-blue-700 italic border-dashed border-b border-blue-700">Edit Timesheet Default Information</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : ''
                        }

                        <div className="form-group flex gap-x-4">
                            <div className="form-item">
                                <button onClick={handleSubmitTimesheetMeta} type="submit" className="px-8 py-2 rounded text-sm uppercase font-semibold bg-purple-700 text-white">Continue</button>
                            </div>
                            <div className="">
                                <Link href="/" className="inline-block py-2 px-8 rounded text-sm uppercase font-semibold border ">Go Back</Link>
                            </div>
                            {/* FOR DEVELOPMENT SAKE*/}
                            <div className="">
                                <Link href="/preview" className="inline-block py-2 px-8 rounded text-sm uppercase font-semibold bg-slate-500 ">Go To Preview Page</Link>
                            </div>
                        </div>
                    </form>
                </div>
                <footer className="pt-4 pb-8">

                </footer>
            </DefaultSection>
        </main>
    )
}
