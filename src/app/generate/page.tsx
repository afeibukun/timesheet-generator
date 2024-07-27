import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import DefaultFormItem from "../_components/DefaultFormItem";
import DefaultLabelText from "../_components/DefaultLabelText";
import DefaultFormGroupTitle from "../_components/DefaultFormGroupTitle";
import DefaultFormGroup from "../_components/DefaultFormGroup";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";

export default function Generate() {
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
                                <input type="text" name="fsrName" id="fsrName" className="inline-block border rounded" />
                            </DefaultFormItem>
                        </div>
                        <DefaultFormGroup>
                            <DefaultFormGroupTitle>Mobilization Date</DefaultFormGroupTitle>
                            <DefaultFormItem>
                                <label htmlFor="workStartDate">
                                    <DefaultLabelText>Date of Work Start</DefaultLabelText>
                                </label>
                                <input type="date" name="workStartDate" id="workStartDate" className="border rounded" />
                            </DefaultFormItem>
                            <DefaultFormItem>
                                <label htmlFor="workFinishDate">
                                    <DefaultLabelText>Date of Work Finish</DefaultLabelText>
                                </label>
                                <input type="date" name="workFinishDate" id="workFinishDate" className="border rounded" />
                            </DefaultFormItem>
                        </DefaultFormGroup>
                        <DefaultFormGroup>
                            <DefaultFormGroupTitle>Customer Information</DefaultFormGroupTitle>
                            <DefaultFormItem>
                                <label htmlFor="customerName">
                                    <DefaultLabelText>Customer Name
                                    </DefaultLabelText>
                                </label>
                                <input type="text" name="customerName" id="customerName" className="border rounded" />
                            </DefaultFormItem>
                            <DefaultFormItem>
                                <label htmlFor="siteName">
                                    <DefaultLabelText>Site Name</DefaultLabelText>

                                </label>
                                <input type="text" name="siteName" id="siteName" className="border rounded" />
                            </DefaultFormItem>
                            <DefaultFormItem>
                                <label htmlFor="siteCountry">
                                    <DefaultLabelText>Site Country</DefaultLabelText>
                                </label>
                                <input type="text" name="siteCountry" id="siteCountry" className="border rounded" />
                            </DefaultFormItem>
                        </DefaultFormGroup>

                        <DefaultFormGroup>
                            <DefaultFormGroupTitle>Project Information</DefaultFormGroupTitle>
                            <DefaultFormItem>
                                <label htmlFor="purchaseOrderNumber">
                                    <DefaultLabelText>Purchase Order (PO) Number</DefaultLabelText>
                                </label>
                                <input type="text" name="purchaseOrderNumber" id="purchaseOrderNumber" className="border rounded" />
                            </DefaultFormItem>
                            <DefaultFormItem>
                                <label htmlFor="orderNumber">
                                    <DefaultLabelText>Order Number</DefaultLabelText>
                                </label>
                                <input type="text" name="orderNumber" id="orderNumber" className="border rounded" />
                            </DefaultFormItem>
                        </DefaultFormGroup>

                        <div className="form-group flex gap-x-4">
                            <div className="form-item">
                                <button type="submit" className="px-8 py-2 rounded text-sm uppercase font-semibold bg-purple-700 text-white">Continue</button>
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