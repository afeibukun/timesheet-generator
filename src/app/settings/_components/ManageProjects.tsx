'use client'
import { ProjectSchema } from "@/lib/types/schema";
import { useEffect, useState } from "react";
import { createProject, deleteDataInStore, getAllProjects } from "@/lib/services/indexedDB/indexedDBService";
import DefaultSection from "../../_components/DefaultSection";
import DefaultSectionHeader from "../../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../../_components/DefaultSectionTitle";
import DefaultLabelText from "../../_components/DefaultLabelText";
import { Status } from "@/lib/constants/constant";
import { StoreName } from "@/lib/constants/storage";

export default function ManageProjects() {
    const [projects, setProjects] = useState([] as ProjectSchema[]);
    const defaultProject = { purchaseOrderNumber: '', orderNumber: '', state: Status.hideForm, notification: { active: false, type: '', message: '' } };
    const [projectForm, setProjectForm] = useState(defaultProject);


    const enum DisplayLabel {
        none = "",
        addForm = "add-item-form-view",
        deleteForm = "delete-item-form-view",
        deleteConfirmationFormView = "delete-item-confirmation-form-view"
    }

    const defaultRemoveFormState = { personnelSlug: '', masterPassword: '', confirmMasterPassword: '', notification: { active: false, type: '', message: '' } };
    const [removePersonnelForm, setRemovePersonnelForm] = useState(defaultRemoveFormState)
    const [tabDisplay, setTabDisplay] = useState(DisplayLabel.none) // add, remove

    useEffect(() => {
        const initializer = async () => {
            try {
                let _projects: ProjectSchema[] = await getAllProjects();
                setProjects(_projects);

            } catch (e) { }
        }
        initializer();
    }, []);

    async function handleSaveProjectEvent(e: any) {
        e.preventDefault(); e.stopPropagation();
        if (projectForm.purchaseOrderNumber) {
            let projectData: ProjectSchema = { purchaseOrderNumber: projectForm.purchaseOrderNumber };
            if (projectForm.orderNumber) {
                projectData.orderNumber = projectForm.orderNumber;
            }
            const newProject = await createProject(projectData);
            setProjects([...projects, newProject]);
            setProjectForm(defaultProject)
        }
    }

    async function handleDeleteProjectEvent(e: any, project: ProjectSchema) {
        e.preventDefault(); e.stopPropagation();
        if (project.id) {
            await deleteDataInStore(project.id, StoreName.project);
            setProjects(projects.filter((_project) => _project.id !== project.id));
            setProjectForm(defaultProject)
        }
    }

    return (
        <div className="management-project">
            <DefaultSection>
                <div>
                    <DefaultSectionHeader>
                        <div className="flex justify-between">
                            <DefaultSectionTitle>Manage Project</DefaultSectionTitle>
                            <button type="button" className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => setProjectForm({ ...projectForm, state: Status.displayForm })}>Add New Project</button>
                        </div>
                    </DefaultSectionHeader>
                    <div>
                        {projectForm.state !== Status.displayForm ?
                            <div className="project-list mb-2">
                                <div className="">
                                    <div className="grid grid-cols-11 gap-x-1 px-2 font-bold">
                                        <div><h4>ID</h4></div>
                                        <div className="col-span-4"><h4>Purchase Order Number</h4></div>
                                        <div className="col-span-4"><h4>Order Number</h4></div>
                                        <div className="col-span-2"></div>
                                    </div>
                                    {projects.length > 0 ?
                                        projects.map((_project) =>
                                            <div key={_project.id} className="grid grid-cols-11 gap-x-1 odd:bg-slate-100 even:bg-white px-2 py-1.5 rounded-sm text-sm mb-1.5">
                                                <div className=""><p>{_project.id}</p></div>
                                                <div className="col-span-4"><p>{_project.purchaseOrderNumber}</p></div>
                                                <div className="col-span-4"><p>{_project.orderNumber ?? <span className="italic">n/a</span>}</p></div>
                                                <div className="col-span-2">
                                                    <button type="button" className="text-xs px-2 py-0.5 bg-red-600 text-white rounded" onClick={(e) => handleDeleteProjectEvent(e, _project)}>Delete</button>
                                                </div>
                                            </div>
                                        ) :
                                        <div>
                                            <div className="bg-slate-200 px-2 py-4 text-center">
                                                <p className="italic text-slate-400">No Projects Saved Yet</p>
                                            </div>
                                        </div>}
                                </div>
                            </div>
                            :
                            <div className="add-new-projects px-2 py-4 border">
                                <div className="mb-3">
                                    <h4 className="font-semibold">Add new Project</h4>
                                </div>
                                <div>
                                    <div>
                                        <label htmlFor="newPurchaseOrderNumber">
                                            <DefaultLabelText>New Purchase Order Number
                                            </DefaultLabelText>
                                        </label>
                                    </div>

                                    <input type="text"
                                        name="newPurchaseOrderNumber"
                                        id="newPurchaseOrderNumber"
                                        value={projectForm.purchaseOrderNumber}
                                        onChange={(e) => setProjectForm({ ...projectForm, purchaseOrderNumber: e.target.value })}
                                        className="border rounded" />
                                </div>
                                <div className="mb-2">
                                    <div>
                                        <label htmlFor="newOrderNumber">
                                            <DefaultLabelText>New Order Number
                                            </DefaultLabelText>
                                        </label>
                                    </div>
                                    <input type="text"
                                        name="newOrderNumber"
                                        id="newOrderNumber"
                                        value={projectForm.orderNumber}
                                        onChange={(e) => setProjectForm({ ...projectForm, orderNumber: e.target.value })}
                                        className="border rounded" />
                                </div>

                                <div className="inline-flex gap-x-2">
                                    <button type="button" className="py-1 px-2 rounded bg-green-400" onClick={(e) => handleSaveProjectEvent(e)}>Save</button>
                                    <button type="button" className="py-1 px-2 rounded bg-red-400" onClick={(e) => setProjectForm({ ...projectForm, state: Status.hideForm })}>Close</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </DefaultSection>
        </div>
    )
}