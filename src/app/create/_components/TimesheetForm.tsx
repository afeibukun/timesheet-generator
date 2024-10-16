
import DefaultFormGroup from "@/app/_components/DefaultFormGroup";
import DefaultFormGroupTitle from "@/app/_components/DefaultFormGroupTitle";
import DefaultFormItem from "@/app/_components/DefaultFormItem"
import DefaultLabelText from "@/app/_components/DefaultLabelText"
import { ComponentType, SearchParamsLabel, SettingSection } from "@/lib/constants/constant";
import { Personnel } from "@/lib/services/meta/personnel";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { PlainTimesheetOption } from "@/lib/types/timesheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Customer } from "@/lib/services/meta/customer";
import { Project } from "@/lib/services/meta/project";

type CreateTimesheetFormProp = {
    personnels: Personnel[],
    customers: Customer[],
    projects: Project[],
}

export default function CreateTimesheetForm({ personnels, customers, projects }: CreateTimesheetFormProp) {
    const router = useRouter();
    const [timesheetForm, setTimesheetForm] = useState({
        personnelSlug: '',
        customerSlug: '',
        siteSlug: '',
        projectPurchaseOrderNumber: '',
        selectedWeek: '',
        autoPopulateEntry: false
    });

    function handleInputChange(e: any, metaKey: string) {
        let metaValue = e.target.value;
        setTimesheetForm({ ...timesheetForm, [metaKey]: metaValue });
    }

    async function handleCreateTimesheet(e: any) {
        e.preventDefault();
        e.stopPropagation();

        let _personnel: Personnel = personnels.filter((p) => p.slug == timesheetForm.personnelSlug)[0];

        let _customer = customers.filter((c) => c.slug == timesheetForm.customerSlug)[0];
        let _site = customers.filter((c) => c.slug == timesheetForm.customerSlug)[0].sites?.filter((s) => s.slug == timesheetForm.siteSlug)[0];
        let _project = projects.filter((p) => p.purchaseOrderNumber == timesheetForm.projectPurchaseOrderNumber)[0];

        let _options: PlainTimesheetOption[] = [
            { key: 'TIMESHEET_WEEK', value: timesheetForm.selectedWeek },
        ];
        if (!_site) throw new Error("Site Not Found");
        const _timesheet = await Timesheet.createTimesheet(timesheetForm.selectedWeek, _personnel, _customer, _site, _project, timesheetForm.autoPopulateEntry);

        router.push(`/review?${SearchParamsLabel.component}=${ComponentType.timesheet}&${SearchParamsLabel.key}=${_timesheet.key}`);
    }

    return (
        <div>
            <form action="" className="timesheet-create-form">
                <div className="form-group">
                    <DefaultFormItem>
                        <label htmlFor="personnel" >
                            <DefaultLabelText>Personnel Name</DefaultLabelText>
                        </label>
                        <select name="personnel" id="personnel" value={timesheetForm.personnelSlug} onChange={(e) => handleInputChange(e, 'personnelSlug')}>
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
                    <DefaultFormGroupTitle>Week Information</DefaultFormGroupTitle>
                    <div>
                        <div className="create-timesheet-prompt">
                            <div>
                                <label htmlFor="weekPicker">Week Picker</label>
                                <input type="week" title="Select Week" id="weekPicker" value={timesheetForm.selectedWeek} onChange={(e) => setTimesheetForm({ ...timesheetForm, selectedWeek: e.target.value })} />
                            </div>
                            <div>
                                <label htmlFor="shouldPopulateDays">Auto Populate Days In the week</label>
                                <input type="checkbox" name="shouldPopulateDays" id="shouldPopulateDays" checked={timesheetForm.autoPopulateEntry} onChange={(e) => setTimesheetForm({ ...timesheetForm, autoPopulateEntry: e.target.checked })} />
                            </div>
                        </div>
                    </div>
                </DefaultFormGroup>
                <DefaultFormGroup>
                    <DefaultFormGroupTitle>Customer Information</DefaultFormGroupTitle>
                    <div>
                        <DefaultFormItem>
                            <label htmlFor="customer">
                                <DefaultLabelText>Customer Name
                                </DefaultLabelText>
                            </label>
                            <select name="customer" id="customer" value={timesheetForm.customerSlug} onChange={(e) => handleInputChange(e, 'customerSlug')}>
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
                                <Link href={`/settings?section=${SettingSection.customer}`}>Manage Customer</Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <DefaultFormItem>
                            <label htmlFor="site">
                                <DefaultLabelText>Site Name</DefaultLabelText>
                            </label>
                            <select name="site" id="site" value={timesheetForm.siteSlug} onChange={(e) => handleInputChange(e, 'siteSlug')}>
                                <option value={undefined} >Select Site</option>
                                {customers.filter((c) => c.slug == timesheetForm.customerSlug)[0]?.sites?.map((site, index) => {
                                    return (
                                        <option key={index} value={site.slug}>{`${site.name}, ${site.country}`}</option>
                                    )
                                })}
                            </select>
                        </DefaultFormItem>
                        <div>
                            <div>
                                <Link href={`/settings?section=${SettingSection.customer}`}>Manage Site</Link>
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
                            <select name="project" id="project" value={timesheetForm.projectPurchaseOrderNumber} onChange={(e) => handleInputChange(e, 'projectPurchaseOrderNumber')} className="w-full">
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
                            <Link href={`/settings?section=${SettingSection.project}`}>Manage Project</Link>
                        </div>
                    </div>
                </DefaultFormGroup>

                <div className="form-group flex gap-x-4">
                    <div className="form-item">
                        <button onClick={(e) => handleCreateTimesheet(e)} type="submit" className="px-8 py-2 rounded text-sm uppercase font-semibold bg-purple-700 text-white">Continue</button>
                    </div>
                    <div className="">
                        <Link href="/" className="inline-block py-2 px-8 rounded text-sm uppercase font-semibold border ">Go Back</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}