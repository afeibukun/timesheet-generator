
import DefaultFormGroup from "@/app/_components/DefaultFormGroup";
import DefaultFormGroupTitle from "@/app/_components/DefaultFormGroupTitle";
import DefaultFormItem from "@/app/_components/DefaultFormItem"
import DefaultLabelText from "@/app/_components/DefaultLabelText"
import { ComponentType, OptionLabel, SearchParamsLabel, SettingSection } from "@/lib/constants/constant";
import { Personnel } from "@/lib/services/meta/personnel";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { TimesheetOption } from "@/lib/types/timesheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Customer } from "@/lib/services/meta/customer";
import { Project } from "@/lib/services/meta/project";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";

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
        selectedMonth: -1,
        possibleMonths: [] as number[],
        daysInSelectedWeek: [] as TimesheetDate[],
        autoPopulateEntry: false,
        mobilizationDate: '',
        demobilizationDate: '',
    });

    useEffect(() => {
        const initializer = async () => {
            try {
                await TimesheetDate.initializeWeekStartDay();
                const _initialSelectedWeek = TimesheetDate.getCurrentWeekYearForWeekForm();
                const _initialWeekYearData = TimesheetDate.extractWeekDataFromPrimitiveWeek(_initialSelectedWeek);
                const _initialMonths = TimesheetDate.getMonthsInAWeek(_initialWeekYearData.week, _initialWeekYearData.year);
                const _initialDaysInWeek = TimesheetDate.getWeekDays(_initialWeekYearData.week)

                setTimesheetForm({
                    ...timesheetForm,
                    personnelSlug: personnels && personnels.length > 0 ? personnels[0].slug : '',
                    customerSlug: customers && customers.length > 0 ? customers[0].slug : '',
                    siteSlug: customers && customers.length > 0 && customers[0].sites ? customers[0].sites[0]?.slug : '',
                    projectPurchaseOrderNumber: projects && projects.length > 0 ? projects[0].purchaseOrderNumber : '',
                    selectedWeek: _initialSelectedWeek,
                    selectedMonth: _initialMonths[0],
                    possibleMonths: _initialMonths,
                    daysInSelectedWeek: _initialDaysInWeek
                });
            } catch (e) { }
        }
        initializer();
    }, []);

    function handleInputChange(e: any, metaKey: string) {
        let metaValue = e.target.value;
        setTimesheetForm({ ...timesheetForm, [metaKey]: metaValue });
    }

    const handleWeekChange = (e: any) => {
        const { year, week } = TimesheetDate.extractWeekDataFromPrimitiveWeek(e.target.value);
        const months = TimesheetDate.getMonthsInAWeek(week, year);
        const _daysInWeek = TimesheetDate.getWeekDays(week)
        setTimesheetForm({ ...timesheetForm, selectedWeek: e.target.value, selectedMonth: months[0], possibleMonths: months, daysInSelectedWeek: _daysInWeek })
    }

    async function handleCreateTimesheet(e: any) {
        e.preventDefault();
        e.stopPropagation();

        let _personnel: Personnel = personnels.filter((p) => p.slug == timesheetForm.personnelSlug)[0];

        let _customer = customers.filter((c) => c.slug == timesheetForm.customerSlug)[0];
        let _site = customers.filter((c) => c.slug == timesheetForm.customerSlug)[0].sites?.filter((s) => s.slug == timesheetForm.siteSlug)[0];
        let _project = projects.filter((p) => p.purchaseOrderNumber == timesheetForm.projectPurchaseOrderNumber)[0];

        let _options: TimesheetOption[] = [
            { key: OptionLabel.timesheetWeek, value: timesheetForm.selectedWeek },
            { key: OptionLabel.mobilizationDate, value: timesheetForm.mobilizationDate },
            { key: OptionLabel.demobilizationDate, value: timesheetForm.demobilizationDate },
        ];

        if (!_site) throw new Error("Site Not Found");
        const { year, week } = TimesheetDate.extractWeekDataFromPrimitiveWeek(timesheetForm.selectedWeek);
        const _timesheet = await Timesheet.createTimesheet(_personnel, _customer, _site, _project, timesheetForm.autoPopulateEntry, _options, week, year, timesheetForm.selectedMonth);

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
                        <div className="timesheet-week-container">
                            <div className="select-timesheet-week mb-1 flex gap-x-3">
                                <label htmlFor="weekPicker">Week Picker</label>
                                <input type="week" title="Select Week" id="weekPicker" value={timesheetForm.selectedWeek} onChange={(e) => handleWeekChange(e)} />
                            </div>
                            <div className="flex gap-x-3 items-center">
                                <div className="w-24">
                                    <p className="capitalize text-sm">{TimesheetDate.monthsInYear[timesheetForm.selectedMonth]}</p>
                                </div>
                                <div className="flex gap-x-1">
                                    {timesheetForm.daysInSelectedWeek.map((_date) =>
                                        <div key={_date.date} className={`h-4 w-4 relative ${_date.monthNumber === timesheetForm.selectedMonth ? 'bg-orange-600 text-white' : 'bg-orange-200 text-black'}`}><span className="text-[8px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{_date.dayInMonth}</span></div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-x-3">
                                <label htmlFor="shouldPopulateDays">Auto Populate Days In the week</label>
                                <input type="checkbox" name="shouldPopulateDays" id="shouldPopulateDays" checked={timesheetForm.autoPopulateEntry} onChange={(e) => setTimesheetForm({ ...timesheetForm, autoPopulateEntry: e.target.checked })} />
                            </div>
                            <>{timesheetForm.possibleMonths && timesheetForm.possibleMonths.length > 0 ?
                                <div className="timesheet-month mt-2">
                                    <div className="flex gap-x-3 items-center">
                                        <p className="">Timesheet Month</p>
                                        <div className="flex gap-x-4 px-2 py-1 rounded bg-slate-100">
                                            {timesheetForm.possibleMonths.map((_month: number) =>
                                                <div key={_month} className="flex gap-x-1">
                                                    <label className="capitalize text-sm" htmlFor={`monthSelector${_month}`}>{TimesheetDate.monthsInYear[_month]}</label>
                                                    <input type="checkbox" name="monthSelector" id={`monthSelector${_month}`} title="Month Selector" checked={timesheetForm.selectedMonth === _month} value={_month} onChange={(e) => setTimesheetForm({ ...timesheetForm, selectedMonth: _month })} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                : ''
                            }</>
                        </div>
                    </div>
                </DefaultFormGroup>

                <DefaultFormGroup>
                    <DefaultFormGroupTitle>Mobilization Date Information</DefaultFormGroupTitle>
                    <DefaultFormItem>
                        <label htmlFor="mobilizationDate">
                            <DefaultLabelText>
                                <span>Personnel Mobilization Date </span>
                                <small className="text-blue-600 italic">Optional</small></DefaultLabelText>
                        </label>
                        <input type="date"
                            value={timesheetForm.mobilizationDate}
                            onChange={(e) => handleInputChange(e, 'mobilizationDate')}
                            name="mobilizationDate" id="mobilizationDate" className="border rounded" />
                    </DefaultFormItem>
                    <DefaultFormItem>
                        <label htmlFor="demobilizationDate">
                            <DefaultLabelText>
                                <span>Personnel Demob Date </span>
                                <small className="text-blue-600 italic">Optional</small></DefaultLabelText>
                        </label>
                        <input type="date"
                            name="demobilizationDate"
                            id="demobilizationDate"
                            value={timesheetForm.demobilizationDate}
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