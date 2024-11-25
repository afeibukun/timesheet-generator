import DefaultFormGroup from "@/app/_components/DefaultFormGroup";
import DefaultFormGroupTitle from "@/app/_components/DefaultFormGroupTitle";
import DefaultFormItem from "@/app/_components/DefaultFormItem"
import DefaultLabelText from "@/app/_components/DefaultLabelText"
import { ComponentType, OptionLabel, SearchParamsLabel, SettingSection, Status } from "@/lib/constants/constant";
import { Personnel } from "@/lib/services/meta/personnel";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { TimesheetOption } from "@/lib/types/timesheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Customer } from "@/lib/services/meta/customer";
import { Project } from "@/lib/services/meta/project";

type CreateTimesheetCollectionFormProp = {
    personnels: Personnel[],
    customers: Customer[],
    projects: Project[],
}
export default function CreateTimesheetCollectionForm({ personnels, customers, projects }: CreateTimesheetCollectionFormProp) {
    const router = useRouter();
    const hasUpdatedDefaultInformation = Timesheet.hasUpdatedDefaultInformation();

    const [timesheetCollectionForm, setTimesheetCollectionForm] = useState({
        personnelSlug: '',
        mobilizationDate: new TimesheetDate(TimesheetDate.basicNowDateFormatted()).dateDecrementByDay(28).basicFormat(),
        demobilizationDate: TimesheetDate.basicNowDateFormatted(),
        customerSlug: '',
        siteSlug: '',
        projectPurchaseOrderNumber: '',
        status: Status.start
    });

    const setFormStatus = (status: Status) => {
        setTimesheetCollectionForm({ ...timesheetCollectionForm, status: status });
    }

    function handleInputChange(e: any, metaKey: string) {
        let metaValue = e.target.value;
        setTimesheetCollectionForm({ ...timesheetCollectionForm, [metaKey]: metaValue });
    }

    async function handleSubmitTimesheetCollection(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setFormStatus(Status.submitting);

        let _personnel: Personnel = personnels.filter((p) => p.slug == timesheetCollectionForm.personnelSlug)[0];

        let _customer = customers.filter((c) => c.slug == timesheetCollectionForm.customerSlug)[0];
        let _site = customers.filter((c) => c.slug == timesheetCollectionForm.customerSlug)[0].sites?.filter((s) => s.slug == timesheetCollectionForm.siteSlug)[0];
        let _project = projects.filter((p) => p.purchaseOrderNumber == timesheetCollectionForm.projectPurchaseOrderNumber)[0];

        let _options: TimesheetOption[] = [
            { key: OptionLabel.mobilizationDate, value: timesheetCollectionForm.mobilizationDate },
            { key: OptionLabel.demobilizationDate, value: timesheetCollectionForm.demobilizationDate }
        ];

        const mobDate = new TimesheetDate(timesheetCollectionForm.mobilizationDate);
        const demobDate = new TimesheetDate(timesheetCollectionForm.demobilizationDate);

        if (!_site) throw new Error("Site Not Found");
        const _timesheetCollectionObject = await Timesheet.createTimesheetCollectionFromMobilizationPeriod(mobDate, demobDate, _personnel, _customer, _site, _project);
        const _timesheetCollection = _timesheetCollectionObject.timesheetCollection;
        setFormStatus(Status.submitted);
        router.push(`/review?${SearchParamsLabel.component}=${ComponentType.timesheetCollection}&${SearchParamsLabel.key}=${_timesheetCollection.key}`);
    }

    return (
        <div>
            <form action="" className="timesheet-collection-create-form">
                <div className="form-group">
                    <DefaultFormItem>
                        <label htmlFor="personnel" >
                            <DefaultLabelText>Personnel Name</DefaultLabelText>
                        </label>
                        <select name="personnel" id="personnel" value={timesheetCollectionForm.personnelSlug} onChange={(e) => handleInputChange(e, 'personnelSlug')}>
                            <option value={undefined} >Select Personnel</option>
                            {personnels.map((personnel) => {
                                return (
                                    <option value={personnel.slug} key={personnel.id}>{personnel.name}</option>)
                            })}
                        </select>
                    </DefaultFormItem>
                    <div>
                        <div>
                            <Link href={`/settings?section=${SettingSection.personnel}`}>Manage Personnel</Link>
                        </div>
                    </div>
                </div>
                <DefaultFormGroup>
                    <DefaultFormGroupTitle>Mobilization Date Information</DefaultFormGroupTitle>
                    <DefaultFormItem>
                        <label htmlFor="mobilizationDate">
                            <DefaultLabelText>
                                <span>Personnel Mobilization Date</span>
                                <small className="text-red-600 italic">Compulsory</small>
                            </DefaultLabelText>
                        </label>
                        <input type="date"
                            value={timesheetCollectionForm.mobilizationDate}
                            onChange={(e) => handleInputChange(e, 'mobilizationDate')}
                            name="mobilizationDate" id="mobilizationDate" className="border rounded" />
                    </DefaultFormItem>
                    <DefaultFormItem>
                        <label htmlFor="demobilizationDate">
                            <DefaultLabelText>
                                <span>Personnel Demob Date</span>
                                <small className="text-red-600 italic">Compulsory</small>
                            </DefaultLabelText>
                        </label>
                        <input type="date"
                            name="demobilizationDate"
                            id="demobilizationDate"
                            value={timesheetCollectionForm.demobilizationDate}
                            onChange={e => handleInputChange(e, 'demobilizationDate')}
                            className="border rounded" />
                    </DefaultFormItem>
                </DefaultFormGroup>
                <DefaultFormGroup>
                    <DefaultFormGroupTitle>Customer Information</DefaultFormGroupTitle>
                    <div>
                        <DefaultFormItem>
                            <label htmlFor="customer">
                                <DefaultLabelText>Customer Name
                                </DefaultLabelText>
                            </label>
                            <select name="customer" id="customer" value={timesheetCollectionForm.customerSlug} onChange={(e) => handleInputChange(e, 'customerSlug')}>
                                <option value={undefined} >Select Customer</option>
                                {customers.map((customer) => {
                                    return (
                                        <option key={customer.id} value={customer.slug}>{customer.name}</option>
                                    )
                                })}
                            </select>
                        </DefaultFormItem>
                        <div>
                            <div>
                                <Link href={`/settings?section=${SettingSection.customer}`}>Manage Customers</Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <DefaultFormItem>
                            <label htmlFor="site">
                                <DefaultLabelText>Site Name</DefaultLabelText>
                            </label>
                            <select name="site" id="site" value={timesheetCollectionForm.siteSlug} onChange={(e) => handleInputChange(e, 'siteSlug')}>
                                <option value={undefined} >Select Site</option>
                                {customers.filter((c) => c.slug == timesheetCollectionForm.customerSlug)[0]?.sites?.map((site, index) => {
                                    return (
                                        <option key={index} value={site.slug}>{`${site.name}, ${site.country}`}</option>
                                    )
                                })}
                            </select>
                        </DefaultFormItem>
                        <div>
                            <div>
                                <Link href={`/settings?section=${SettingSection.customer}`}>Manage Sites</Link>
                            </div>
                        </div>
                    </div>
                </DefaultFormGroup>

                <DefaultFormGroup>
                    <DefaultFormGroupTitle>Project Information</DefaultFormGroupTitle>
                    <DefaultFormItem>
                        <label htmlFor="project">
                            <DefaultLabelText>Project Information:</DefaultLabelText>
                        </label>
                        <div>
                            <select name="project" id="project" value={timesheetCollectionForm.projectPurchaseOrderNumber} onChange={(e) => handleInputChange(e, 'projectPurchaseOrderNumber')} className="w-full">
                                <option value={undefined} >Select Project</option>
                                {projects.map((project, index) => {
                                    return (
                                        <option key={project.id} value={project.purchaseOrderNumber}>{`PO No - ${project.purchaseOrderNumber} ${project.orderNumber ? ', Order No - ' + project.orderNumber : ''}`}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </DefaultFormItem>
                    <div>
                        <div>
                            <Link href={`/settings?section=${SettingSection.project}`}>Manage Projects</Link>
                        </div>
                    </div>
                </DefaultFormGroup>

                {false ?
                    <div className="form-notice-group">
                        <div className="p-3 bg-slate-200 rounded mb-4">
                            <div className="">
                                <h4 className="text-lg font-semibold text-slate-800">Timesheet Default Information</h4>
                                {!hasUpdatedDefaultInformation ?
                                    <p className="text-sm"><b className="inline-block bg-orange-300 px-1 py-0.5 rounded">WARNING:</b> You have not reviewed the Timesheet Default Information recently, Kindly confirm that the default data below is okay to auto populate the timesheet. Otherwise you can edit the Timesheet Default Information <Link href="/default-information" className="text-blue-700 border-dashed border-b border-blue-700 italic">Here!</Link></p>
                                    :
                                    <p className="text-sm"><b className="inline-block bg-blue-300 px-1 py-0.5 rounded">Gentle Reminder:</b> You can review your Timesheet Default Information here, Confirm that the default data below is okay to auto populate the timesheet. If you want edit the Timesheet Default Information, Click <Link href="/default-information" className="text-blue-700 border-dashed border-b border-blue-700 italic">Here!</Link></p>
                                }
                            </div>
                            <div className='h-auto overflow-auto'>
                                <div className="mb-4">
                                    <Link href="/settings" className="text-blue-700 italic border-dashed border-b border-blue-700">Edit Timesheet Default Information</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    : ''
                }

                <div className="form-group flex gap-x-4">
                    <div className="form-item">
                        <button onClick={(e) => handleSubmitTimesheetCollection(e)} type="submit" className="px-8 py-2 rounded text-sm uppercase font-semibold bg-purple-700 text-white">Continue</button>
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
    )
}