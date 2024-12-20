'use client'
import DefaultSection from "../_components/DefaultSection";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";
import { useEffect, useState } from "react";
import { ComponentType, SearchParamsLabel, Status } from "@/lib/constants/constant";
import { useRouter, useSearchParams } from "next/navigation";
import { Personnel } from "@/lib/services/meta/personnel";
import CreateTimesheetCollectionForm from "./_components/TimesheetCollectionForm";
import CreateTimesheetForm from "./_components/TimesheetForm";
import { Customer } from "@/lib/services/meta/customer";
import { Project } from "@/lib/services/meta/project";
import { defaultLogoBase64 } from "@/lib/constants/defaultLogoBase64Image";
import Link from "next/link";

export default function Create() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const component = searchParams.get(SearchParamsLabel.component) === ComponentType.timesheetCollection ? ComponentType.timesheetCollection : ComponentType.timesheet;

    const [personnels, setPersonnels] = useState([] as Personnel[]);

    const [customers, setCustomers] = useState([] as Customer[]);

    const [projects, setProjects] = useState([] as Project[]);

    const [status, setStatus] = useState(Status.enteringData);
    const [viewState, setViewState] = useState(Status.new);


    useEffect(() => {
        const initializer = async () => {
            try {
                const _personnels: Personnel[] = await Personnel.getAllPersonnel();
                setPersonnels(_personnels);
                const _customers: Customer[] = await Customer.getAllCustomers();
                setCustomers(_customers);
                const _projects: Project[] = await Project.getAllProjects();
                setProjects(_projects);
            } catch (e) { }
        }
        initializer();
    }, []);

    return (
        <main className="container">
            <DefaultSection>
                <DefaultSectionHeader>
                    <div className="">
                        <div className="mb-8">
                            <Link href={'/'}>
                                <img src={defaultLogoBase64} alt="timesheet generator app" className="h-12" />
                            </Link>
                        </div>
                        <DefaultSectionTitle>
                            <span>
                                <span>{viewState == Status.new ? 'Create ' : 'Edit '}</span>
                                <span>{component === ComponentType.timesheet ? 'Timesheet' : 'Timesheet Collection'} </span>
                                <span>{viewState == Status.new ? '🆕' : '✍'}</span>
                            </span>
                        </DefaultSectionTitle>
                    </div>
                </DefaultSectionHeader>
                <div className="section-body">
                    {component === ComponentType.timesheetCollection ?
                        <CreateTimesheetCollectionForm personnels={personnels} customers={customers} projects={projects} />
                        :
                        <CreateTimesheetForm personnels={personnels} customers={customers} projects={projects} />
                    }
                </div>
                <footer className="pt-4 pb-8">

                </footer>
            </DefaultSection>
        </main>
    )
}
