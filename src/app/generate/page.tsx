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
import { StatusEnum as StateEnum } from "@/lib/constants/enum";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { TimesheetMeta } from "@/lib/services/timesheet/timesheetMeta";
import { useRouter } from "next/navigation";
import { TimesheetLocalStorage } from "@/lib/services/timesheet/timesheetLocalStorage";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import moment from "moment";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { CustomerInterface, DefaultPrimitiveTimesheetEntryDataInterface, PrimitiveTimesheetMetaInterface, ProjectInterface, SiteInterface, TimesheetOptionInterface } from "@/lib/types/timesheetType";
import { initialTimesheetMeta } from "@/lib/constants/defaultData";
import { createCustomer, createPersonnel, createProject, createSiteForCustomer, getAllCustomers, getAllPersonnel, getAllProjects } from "@/lib/services/indexedDB/indexedDBService";
import { CustomerSchema, PersonnelSchema, ProjectSchema } from "@/lib/constants/schema";
import { slugify } from "@/lib/helpers";
import { Personnel } from "@/lib/services/personnel";

export default function Generate() {
    const router = useRouter();

    const [timesheetDefaultData, setTimesheetDefaultData] = useState({} as DefaultPrimitiveTimesheetEntryDataInterface);
    const _initializer = async () => {
        let defaultData = await TimesheetEntry.defaultInformation();
        setTimesheetDefaultData(defaultData)
    }
    _initializer();

    const hasUpdatedDefaultInformation = Timesheet.hasUpdatedDefaultInformation();
    const [timesheetDefaultViewStatus, setTimesheetDefaultViewStatus] = useState(StateEnum.hidden);

    const [personnels, setPersonnels] = useState([] as PersonnelSchema[]);
    const [primitivePersonnel, setPrimitivePersonnel] = useState({ personnelName: '' });
    const [createPersonnelState, setPersonnelCreationState] = useState(StateEnum.hideForm);

    const [customers, setCustomers] = useState([] as CustomerSchema[]);
    const [primitiveCustomer, setPrimitiveCustomer] = useState({ customerName: '' });
    const [createCustomerState, setCreateCustomerState] = useState(StateEnum.hideForm);

    const [primitiveSite, setPrimitiveSite] = useState({ siteName: '', siteCountry: '' });
    const [createSiteState, setCreateSiteState] = useState(StateEnum.hideForm);

    const [projects, setProjects] = useState([] as ProjectSchema[]);
    const [primitiveProject, setPrimitiveProject] = useState({ purchaseOrderNumber: '', orderNumber: '' });
    const [createProjectState, setCreateProjectState] = useState(StateEnum.hideForm);

    const [primitiveTimesheetGenerateForm, setPrimitiveTimesheetGenerateForm] = useState({
        personnelSlug: '',
        mobilizationDate: new TimesheetDate(TimesheetDate.basicNowDateFormatted()).dateDecrementByDay(28).basicFormat(),
        demobilizationDate: TimesheetDate.basicNowDateFormatted(),
        customerSlug: '',
        siteSlug: '',
        projectPurchaseOrderNumber: ''

    });
    const [timesheet, setTimesheet] = useState(null as Timesheet | null);

    const [status, setStatus] = useState(StateEnum.enteringData);
    const [viewState, setViewState] = useState(StateEnum.new);


    useEffect(() => {
        const initializer = async () => {
            var retrievedTimesheet
            try {
                let allPersonnel: PersonnelSchema[] = await getAllPersonnel();
                setPersonnels(allPersonnel);

                let allCustomers: CustomerSchema[] = await getAllCustomers();
                setCustomers(allCustomers);

                let allProjects: ProjectSchema[] = await getAllProjects();
                setProjects(allProjects);

                setPrimitiveTimesheetGenerateForm({
                    ...primitiveTimesheetGenerateForm,
                    personnelSlug: allPersonnel[0]?.slug,
                    customerSlug: allCustomers[0]?.slug,
                    siteSlug: allCustomers[0]?.sites[0]?.slug,
                    projectPurchaseOrderNumber: allProjects[0]?.purchaseOrderNumber
                })
                retrievedTimesheet = TimesheetLocalStorage.getTimesheetFromLocalStorage();
                setTimesheet(retrievedTimesheet);
            } catch (e) { }

            if (retrievedTimesheet != undefined) {
                setViewState(StateEnum.updating);
            }
        }
        initializer();
    }, []);

    function handleInputChange(e: any, metaKey: string) {
        let metaValue = e.target.value;
        setPrimitiveTimesheetGenerateForm({ ...primitiveTimesheetGenerateForm, [metaKey]: metaValue });
    }

    async function handleSavePersonnelEvent(e: any) {
        e.preventDefault(); e.stopPropagation();
        if (primitivePersonnel.personnelName) {
            // Save in DB
            const newPersonnel = await createPersonnel(primitivePersonnel.personnelName);
            // Save In Local State
            setPersonnels([...personnels, newPersonnel]);
            setPrimitivePersonnel({ personnelName: '' });
            setPersonnelCreationState(StateEnum.hideForm)
        }
    }

    async function handleSaveCustomerEvent(e: any) {
        e.preventDefault(); e.stopPropagation();
        if (primitiveCustomer.customerName) {
            // Save in DB
            const newCustomer = await createCustomer(primitiveCustomer.customerName);
            // Save In Local State
            setCustomers([...customers, newCustomer]);
            setPrimitiveCustomer({ customerName: '' });
            setCreateCustomerState(StateEnum.hideForm)
        }
    }

    async function handleSaveSiteEvent(e: any) {
        e.preventDefault(); e.stopPropagation();
        if (primitiveSite.siteName && primitiveSite.siteCountry) {
            // Save in DB
            const siteSlug = slugify(`${primitiveSite.siteName} ${primitiveSite.siteCountry}`)
            const siteData = { slug: siteSlug, name: primitiveSite.siteName, country: primitiveSite.siteCountry };
            const updatedCustomerWithNewSite = await createSiteForCustomer(siteData, primitiveTimesheetGenerateForm.customerSlug);
            // Save In Local State
            const updatedCustomers = customers.map((c) => {
                if (c.slug == primitiveTimesheetGenerateForm.customerSlug) {
                    return updatedCustomerWithNewSite
                } else return c
            })
            setCustomers(updatedCustomers);
            setPrimitiveSite({ siteName: '', siteCountry: '' });
            setCreateSiteState(StateEnum.hideForm)
        }
    }

    async function handleSaveProjectEvent(e: any) {
        e.preventDefault(); e.stopPropagation();
        if (primitiveProject.purchaseOrderNumber) {
            let projectData: ProjectSchema = { purchaseOrderNumber: primitiveProject.purchaseOrderNumber };
            if (primitiveProject.orderNumber) {
                projectData.orderNumber = primitiveProject.orderNumber;
            }
            const newProject = await createProject(projectData);
            setProjects([...projects, newProject]);
            setPrimitiveProject({ purchaseOrderNumber: '', orderNumber: '' })
            setCreateProjectState(StateEnum.hideForm);
        }
    }

    async function handleSubmitTimesheetMeta(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setStatus(StateEnum.submitting);

        let selectedPersonnel: PersonnelSchema = personnels.filter((p) => p.slug == primitiveTimesheetGenerateForm.personnelSlug)[0];
        let _personnel = Personnel.convertPersonnelSchemaToPersonnel(selectedPersonnel);

        let _customer = customers.filter((c) => c.slug == primitiveTimesheetGenerateForm.customerSlug)[0] as CustomerInterface;
        let _site = customers.filter((c) => c.slug == primitiveTimesheetGenerateForm.customerSlug)[0].sites?.filter((s) => s.slug == primitiveTimesheetGenerateForm.siteSlug)[0] as SiteInterface;
        let _project = projects.filter((p) => p.purchaseOrderNumber == primitiveTimesheetGenerateForm.projectPurchaseOrderNumber)[0] as ProjectInterface;

        let _options: TimesheetOptionInterface[] = [
            { key: 'MOBILIZATION_DATE', value: primitiveTimesheetGenerateForm.mobilizationDate },
            { key: 'DEMOBILIZATION_DATE', value: primitiveTimesheetGenerateForm.demobilizationDate }
        ];

        const mobDate = new TimesheetDate(primitiveTimesheetGenerateForm.mobilizationDate);
        const demobDate = new TimesheetDate(primitiveTimesheetGenerateForm.demobilizationDate);

        const timesheetCollection = await Timesheet.createTimesheetCollectionFromMobilizationPeriod(mobDate, demobDate, _personnel, _customer, _site, _project);
        setStatus(StateEnum.submitted);
        router.push('/preview');
    }

    return (
        <main className="container">
            <DefaultSection>
                <DefaultSectionHeader>
                    <DefaultSectionTitle><span>{viewState == StateEnum.new ? 'Generate New ' : 'Edit '} Timesheet</span>
                        {viewState == StateEnum.new ? <span>🆕</span> : <span>✍</span>}
                    </DefaultSectionTitle>
                </DefaultSectionHeader>
                <div className="section-body">
                    <form action="">
                        <div className="form-group">
                            <DefaultFormItem>
                                <label htmlFor="personnel" >
                                    <DefaultLabelText>Personnel Name</DefaultLabelText>
                                </label>
                                <select name="personnel" id="personnel" value={primitiveTimesheetGenerateForm.personnelSlug} onChange={(e) => handleInputChange(e, 'personnelSlug')}>
                                    <option value={undefined} >Select Personnel</option>
                                    {personnels.map((personnel) => {
                                        return (
                                            <option value={personnel.slug} key={personnel.id}>{personnel.name}</option>)
                                    })}
                                </select>
                            </DefaultFormItem>
                            <div>
                                {createPersonnelState == StateEnum.hideForm ?
                                    <div className="add-personnel-trigger">
                                        <button type="button" onClick={(e) => setPersonnelCreationState(StateEnum.displayForm)} className="px-2 py-1 rounded text-black bg-slate-300">Add New Personnel</button>
                                    </div> : ''}

                                {createPersonnelState == StateEnum.displayForm ?
                                    <div className="flex gap-2">
                                        <label htmlFor="newPersonnelName" >
                                            <DefaultLabelText>New Personnel Name</DefaultLabelText>
                                        </label>
                                        <input type="text"
                                            value={primitivePersonnel.personnelName}
                                            onChange={(e) => setPrimitivePersonnel({ personnelName: e.target.value })}
                                            name="newPersonnelName"
                                            id="newPersonnelName"
                                            className="inline-block border rounded" />
                                        <div className="inline-flex gap-2">
                                            <button className="p-1 rounded text-white bg-green-600" type="button" onClick={(e) => handleSavePersonnelEvent(e)}>Submit</button>
                                            <button className="p-1 rounded text-white bg-red-500" type="button" onClick={(e) => setPersonnelCreationState(StateEnum.hideForm)}>Close</button>
                                        </div>
                                    </div> : ''}
                            </div>
                        </div>
                        <DefaultFormGroup>
                            <DefaultFormGroupTitle>Mobilization Date Information</DefaultFormGroupTitle>
                            <DefaultFormItem>
                                <label htmlFor="mobilizationDate">
                                    <DefaultLabelText>Personnel Mobilization Date</DefaultLabelText>
                                </label>
                                <input type="date"
                                    value={primitiveTimesheetGenerateForm.mobilizationDate}
                                    onChange={(e) => handleInputChange(e, 'mobilizationDate')}
                                    name="mobilizationDate" id="mobilizationDate" className="border rounded" />
                            </DefaultFormItem>
                            <DefaultFormItem>
                                <label htmlFor="demobilizationDate">
                                    <DefaultLabelText>Personnel Demob Date</DefaultLabelText>
                                </label>
                                <input type="date"
                                    name="demobilizationDate"
                                    id="demobilizationDate"
                                    value={primitiveTimesheetGenerateForm.demobilizationDate}
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
                                    <select name="customer" id="customer" value={primitiveTimesheetGenerateForm.customerSlug} onChange={(e) => handleInputChange(e, 'customerSlug')}>
                                        <option value={undefined} >Select Customer</option>
                                        {customers.map((customer) => {
                                            return (
                                                <option key={customer.id} value={customer.slug}>{customer.name}</option>
                                            )
                                        })}
                                    </select>
                                </DefaultFormItem>
                                <div>
                                    {createCustomerState == StateEnum.hideForm ?
                                        <div>
                                            <button type="button" className="py-1 px-2 rounded bg-slate-400" onClick={(e) => setCreateCustomerState(StateEnum.displayForm)}>Add New Customer</button>
                                        </div>
                                        : ''
                                    }

                                    {createCustomerState == StateEnum.displayForm ?
                                        <div className="flex gap-x-1">
                                            <label htmlFor="newCustomerName">
                                                <DefaultLabelText>New Customer Name
                                                </DefaultLabelText>
                                            </label>
                                            <input type="text"
                                                name="newCustomerName"
                                                id="newCustomerName"
                                                value={primitiveCustomer.customerName}
                                                onChange={(e) => setPrimitiveCustomer({ customerName: e.target.value })}
                                                className="border rounded" />
                                            <div className="inline-flex gap-x-2">
                                                <button type="button" className="py-1 px-2 rounded bg-green-400" onClick={(e) => handleSaveCustomerEvent(e)}>Save</button>
                                                <button type="button" className="py-1 px-2 rounded bg-red-400" onClick={(e) => setCreateCustomerState(StateEnum.hideForm)}>Close</button>
                                            </div>
                                        </div>
                                        : ''}
                                </div>
                            </div>
                            <div>
                                <DefaultFormItem>
                                    <label htmlFor="site">
                                        <DefaultLabelText>Site Name</DefaultLabelText>
                                    </label>
                                    <select name="site" id="site" value={primitiveTimesheetGenerateForm.siteSlug} onChange={(e) => handleInputChange(e, 'siteSlug')}>
                                        <option value={undefined} >Select Site</option>
                                        {customers.filter((c) => c.slug == primitiveTimesheetGenerateForm.customerSlug)[0]?.sites.map((site, index) => {
                                            return (
                                                <option key={index} value={site.slug}>{`${site.name}, ${site.country}`}</option>
                                            )
                                        })}
                                    </select>
                                </DefaultFormItem>
                                <div>
                                    {createSiteState == StateEnum.hideForm ?
                                        <div>
                                            <button type="button" className="py-1 px-2 rounded bg-slate-400" onClick={(e) => setCreateSiteState(StateEnum.displayForm)}>Add Site</button>
                                        </div>
                                        : ''
                                    }

                                    {createSiteState == StateEnum.displayForm ?
                                        <div className="flex gap-x-1">
                                            <div>
                                                <label htmlFor="newSiteName">
                                                    <DefaultLabelText>New Site Name
                                                    </DefaultLabelText>
                                                </label>
                                                <input type="text"
                                                    name="newSiteName"
                                                    id="newSiteName"
                                                    value={primitiveSite.siteName}
                                                    onChange={(e) => setPrimitiveSite({ ...primitiveSite, siteName: e.target.value })}
                                                    className="border rounded" />
                                            </div>
                                            <div>
                                                <label htmlFor="newSiteCountry">
                                                    <DefaultLabelText>New Site Country
                                                    </DefaultLabelText>
                                                </label>
                                                <input type="text"
                                                    name="newSiteCountry"
                                                    id="newSiteCountry"
                                                    value={primitiveSite.siteCountry}
                                                    onChange={(e) => setPrimitiveSite({ ...primitiveSite, siteCountry: e.target.value })}
                                                    className="border rounded" />
                                            </div>

                                            <div className="inline-flex gap-x-2">
                                                <button type="button" className="py-1 px-2 rounded bg-green-400" onClick={(e) => handleSaveSiteEvent(e)}>Save</button>
                                                <button type="button" className="py-1 px-2 rounded bg-red-400" onClick={(e) => setCreateSiteState(StateEnum.hideForm)}>Close</button>
                                            </div>
                                        </div>
                                        : ''}
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
                                    <select name="project" id="project" value={primitiveTimesheetGenerateForm.projectPurchaseOrderNumber} onChange={(e) => handleInputChange(e, 'projectPurchaseOrderNumber')} className="w-full">
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
                                {createProjectState == StateEnum.hideForm ?
                                    <div>
                                        <button type="button" className="py-1 px-2 rounded bg-slate-400" onClick={(e) => setCreateProjectState(StateEnum.displayForm)}>Add Project Data</button>
                                    </div>
                                    : ''
                                }

                                {createProjectState == StateEnum.displayForm ?
                                    <div className="flex gap-x-1">
                                        <div>
                                            <label htmlFor="newPurchaseOrderNumber">
                                                <DefaultLabelText>New Purchase Order Number
                                                </DefaultLabelText>
                                            </label>
                                            <input type="text"
                                                name="newPurchaseOrderNumber"
                                                id="newPurchaseOrderNumber"
                                                value={primitiveProject.purchaseOrderNumber}
                                                onChange={(e) => setPrimitiveProject({ ...primitiveProject, purchaseOrderNumber: e.target.value })}
                                                className="border rounded" />
                                        </div>
                                        <div>
                                            <label htmlFor="newOrderNumber">
                                                <DefaultLabelText>New Order Number
                                                </DefaultLabelText>
                                            </label>
                                            <input type="text"
                                                name="newOrderNumber"
                                                id="newOrderNumber"
                                                value={primitiveProject.orderNumber}
                                                onChange={(e) => setPrimitiveProject({ ...primitiveProject, orderNumber: e.target.value })}
                                                className="border rounded" />
                                        </div>

                                        <div className="inline-flex gap-x-2">
                                            <button type="button" className="py-1 px-2 rounded bg-green-400" onClick={(e) => handleSaveProjectEvent(e)}>Save</button>
                                            <button type="button" className="py-1 px-2 rounded bg-red-400" onClick={(e) => setCreateProjectState(StateEnum.hideForm)}>Close</button>
                                        </div>
                                    </div>
                                    : ''}
                            </div>
                        </DefaultFormGroup>

                        {timesheet?.isNull ?
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
                                            <button type="button" onClick={() => setTimesheetDefaultViewStatus(timesheetDefaultViewStatus == StateEnum.visible ? StateEnum.hidden : StateEnum.visible)} className="border-dashed border-b border-slate-400 text-xs text-slate-400 italic">[Show {timesheetDefaultViewStatus == StateEnum.visible ? 'Less' : 'More'}]</button>
                                        </div>
                                    </div>
                                    <div className={timesheetDefaultViewStatus == StateEnum.visible ? 'h-auto overflow-auto' : 'h-0 overflow-hidden'}>
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
                                <button onClick={(e) => handleSubmitTimesheetMeta(e)} type="submit" className="px-8 py-2 rounded text-sm uppercase font-semibold bg-purple-700 text-white">Continue</button>
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
