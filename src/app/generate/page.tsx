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
import { TimesheetMetaData } from "@/lib/types/timesheetType";
import { currentTimesheetMetaLabel, statusConstants } from "@/lib/constants";

export default function Generate() {
    const _initialTimesheetMeta: TimesheetMetaData = {
        fsrName: "",
        mobilizationDate: "",
        demobilizationDate: "",
        customerName: "",
        siteName: "",
        siteCountry: "",
        purchaseOrderNumber: "",
        orderNumber: null,
    }
    const [timesheetMeta, setTimesheetMeta] = useState(_initialTimesheetMeta);

    const [status, setStatus] = useState(statusConstants.enteringData);

    useEffect(() => {
        const rawCurrentTimesheetMeta = localStorage.getItem(currentTimesheetMetaLabel);
        if (rawCurrentTimesheetMeta != null && rawCurrentTimesheetMeta != undefined) {
            setTimesheetMeta(JSON.parse(rawCurrentTimesheetMeta));
        }
    }, []);

    function handleInputChange(e: any, metaDataKey: string) {
        setTimesheetMeta({ ...timesheetMeta, [metaDataKey]: e.target.value });
    }

    function handleSubmitTimesheetMeta(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setStatus(statusConstants.submitting);
        localStorage.setItem(currentTimesheetMetaLabel, JSON.stringify(timesheetMeta));
        setStatus(statusConstants.submitted);
    }
    return (
        <main className="container">
            <DefaultSection>
                <DefaultSectionHeader>
                    <DefaultSectionTitle>Generate Timesheet</DefaultSectionTitle>
                </DefaultSectionHeader>
                <div className="section-body">
                    <form action="">
                        <div className="form-group">
                            <DefaultFormItem>
                                <label htmlFor="fsrName" >
                                    <DefaultLabelText>FSR Name</DefaultLabelText>
                                </label>
                                <input type="text"
                                    value={timesheetMeta.fsrName}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'fsrName');
                                        }
                                    }
                                    name="fsrName"
                                    id="fsrName"
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
                                    value={timesheetMeta.mobilizationDate}
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
                                    value={timesheetMeta.demobilizationDate}
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
                                    value={timesheetMeta.customerName}
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
                                    value={timesheetMeta.siteName}
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
                                    value={timesheetMeta.siteCountry}
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
                                    value={timesheetMeta.purchaseOrderNumber}
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
                                    value={timesheetMeta.orderNumber?.toString()}
                                    onChange={
                                        e => {
                                            handleInputChange(e, 'orderNumber');
                                        }
                                    } className="border rounded" />
                            </DefaultFormItem>
                        </DefaultFormGroup>

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