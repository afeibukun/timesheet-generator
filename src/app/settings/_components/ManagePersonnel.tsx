'use client'
import { useEffect, useState } from "react";
import AddPersonnel from "../../_components/AddPersonnel";
import { Personnel } from "@/lib/services/meta/personnel";
import { getAllPersonnel } from "@/lib/services/indexedDB/indexedDBService";
import DefaultSection from "../../_components/DefaultSection";
import DefaultSectionHeader from "../../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../../_components/DefaultSectionTitle";
import ActivePersonnel from "../../_components/ActivePersonnel";
import { Status } from "@/lib/constants/constant";
import { PlainPersonnel } from "@/lib/types/meta";
import Modal from "@/app/_components/Modal";
import AddPersonnelModal from "@/app/settings/_components/AddPersonnelModal";
import DeletePersonnelModal from "./DeletePersonnelModal";
import UpdatePersonnelModal from "./UpdatePersonnelModal";

export default function ManagePersonnel() {
    const [personnels, setPersonnels] = useState([] as PlainPersonnel[]);
    const [primitiveActivePersonnel, setPrimitiveActivePersonnel] = useState({ displayForm: false, personnelSlug: '' })
    const [localActivePersonnel, setLocalActivePersonnel] = useState({} as Personnel)
    let _selectedPersonnel: PlainPersonnel | undefined
    const [selectedPersonnel, setSelectedPersonnel] = useState(_selectedPersonnel)
    const [showAddNewPersonnelModal, setShowAddNewPersonnelModal] = useState(false)
    const [showUpdatePersonnelModal, setShowUpdatePersonnelModal] = useState(false)

    const enum DisplayLabel {
        none = "",
        addForm = "add-item-form-view",
        deleteForm = "delete-item-form-view",
        deleteConfirmationFormView = "delete-item-confirmation-form-view"
    }

    const enum PersonnelFormView {
        displayAddForm = "display-add-personnel-form-view",
        displayDeleteForm = "display-delete-personnel-form-view",
        displayDeleteConfirmationFormView = "display-delete-personnel-confirmation-form-view"
    }
    type PersonnelFormViewState = Status | PersonnelFormView

    const [personnelFormView, setPersonnelFormView] = useState(Status.hidden as PersonnelFormViewState)

    const defaultRemoveFormState = { personnelSlug: '', masterPassword: '', confirmMasterPassword: '', notification: { active: false, type: '', message: '' } };
    const [removePersonnelForm, setRemovePersonnelForm] = useState(defaultRemoveFormState)
    const [tabDisplay, setTabDisplay] = useState(DisplayLabel.none) // add, remove

    useEffect(() => {
        const initializer = async () => {
            try {
                let _personnels: PlainPersonnel[] = await getAllPersonnel();
                setPersonnels(_personnels);

                try {
                    const _activePersonnel = await Personnel.getActivePersonnel();
                    setLocalActivePersonnel(_activePersonnel);
                } catch (e) { }

            } catch (e) { }
        }
        initializer();
    }, []);

    const saveActivePersonnelEventHandler = async (newActivePersonnel: PlainPersonnel) => {
        if (!!newActivePersonnel.slug) {
            const _selectedPersonnelSchema = personnels.filter(p => p.slug === newActivePersonnel.slug)[0];
            if (_selectedPersonnelSchema.id) {
                const _selectedPersonnelInterface = _selectedPersonnelSchema as PlainPersonnel
                const _selectedPersonnel: Personnel = new Personnel(_selectedPersonnelInterface);
                await Personnel.saveActivePersonnel(_selectedPersonnel)
                setLocalActivePersonnel(_selectedPersonnel);
            }
        }
    }

    const initiateDeletePersonnelEventHandler = (personnel: PlainPersonnel) => {
        setSelectedPersonnel(personnel)
        setPersonnelFormView(PersonnelFormView.displayDeleteConfirmationFormView);
    }

    const removePersonnelEventHandler = async (personnel: Personnel | PlainPersonnel) => {
        const isPersonnelInPersonnelArray = !!personnel.id && personnels.some((p) => p.id === personnel.id);
        if (isPersonnelInPersonnelArray) {
            setPersonnels(personnels.filter((_personnel) => _personnel.id !== personnel.id));
            if (localActivePersonnel.slug === personnel.slug) {
                setLocalActivePersonnel({} as Personnel);
            }
        }
    }

    const updatePersonnelsEventHandler = async () => {
        if (selectedPersonnel) {
            const _updatedPersonnels = personnels.map((_personnel) => {
                if (_personnel.slug === selectedPersonnel?.slug) return selectedPersonnel
                return _personnel
            })
            const _personnel = new Personnel(selectedPersonnel)
            await Personnel.updatePersonnel(_personnel);
            setPersonnels(_updatedPersonnels)
        }
        setSelectedPersonnel(undefined)
        setShowUpdatePersonnelModal(false)
    }

    return (
        <div className="personnel-management">
            <DefaultSection>
                <DefaultSectionHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <DefaultSectionTitle>Manage Personnel</DefaultSectionTitle>
                        </div>
                        <div className="add-personnel-display-trigger flex items-center gap-x-2">
                            <button type="button" className={`py-2 px-3 rounded text-sm  ${tabDisplay === DisplayLabel.addForm ? 'bg-blue-100 text-black' : 'bg-blue-800 hover:bg-blue-600 text-white'}`} onClick={() => setPersonnelFormView(PersonnelFormView.displayAddForm)}>Add New Personnel</button>
                        </div>
                    </div>
                </DefaultSectionHeader>
                <div className="change-active-personnel mb-2" id='active-personnel'>
                    <div className="flex justify-between py-3 px-2 rounded bg-slate-200">
                        <div>
                            <ActivePersonnel activePersonnel={localActivePersonnel} />
                        </div>
                    </div>
                </div>
                <div className="personnel-list">
                    {personnels.length > 0 ?
                        <div className="mb-3">
                            <div className="grid grid-cols-12 px-2 py-1 rounded font-bold text-sm bg-slate-50">
                                <div><h4>S/N</h4></div>
                                <div className="col-span-4"><h4>Personnel Name</h4></div>
                                <div className="col-span-4"><h4>Options</h4></div>
                                <div className="col-span-3"></div>
                            </div>
                            <>
                                {personnels.map((_personnel, index) =>
                                    <div key={_personnel.id} className="px-2 odd:bg-blue-100">
                                        <div className="grid grid-cols-12 py-0.5 items-center">
                                            <div className="serial-number-field"><p>{index + 1}</p></div>
                                            <div className="personnel-name-field col-span-4">
                                                <p className="">
                                                    <span className="inline-block mr-1">{_personnel.name}</span>
                                                    <>{_personnel.slug === localActivePersonnel.slug ? <span className="px-2 py-0.5 rounded text-emerald-100 bg-emerald-600 text-xs">Active</span> : ''}</>
                                                </p>
                                            </div>
                                            <div className="personnel-options-field col-span-4 ">
                                                <>{_personnel.options && _personnel.options.length > 0 ? _personnel.options?.map((options, index) =>
                                                    <div key={index} className="inline-block text-xs px-2 py-1 rounded bg-slate-200">
                                                        <span className="font-bold">{options.key}</span>
                                                        <span> | </span>
                                                        <span className="border-b border-slate-500">{options.value}</span>
                                                    </div>
                                                ) : <p className="inline-block px-2 py-1 bg-slate-200 rounded italic text-[10px]">No Options Found</p>}</>
                                            </div>
                                            <div className="personnel-actions-field flex gap-x-1 justify-end col-span-3">
                                                <>{_personnel.slug !== localActivePersonnel.slug ? <button type="button" className="px-2 py-0.5 text-xs bg-emerald-700 text-white rounded" onClick={(e) => saveActivePersonnelEventHandler(_personnel)}>Set as Active</button> : ''}</>
                                                <button type="button" className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded" onClick={() => {
                                                    setSelectedPersonnel(_personnel)
                                                    setShowUpdatePersonnelModal(true)
                                                }}>Edit</button>
                                                <button type="button" className="px-2 py-0.5 text-xs bg-red-600 text-white rounded" onClick={() => initiateDeletePersonnelEventHandler(_personnel)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        </div>
                        : <div className="mb-3">
                            <div className="py-4 px-3 text-center bg-slate-200 text-slate-400">
                                <p>No Personnel Saved Yet</p>
                            </div>
                        </div>
                    }
                </div>



                {/* Add New Personnel */}
                <AddPersonnelModal showModal={personnelFormView === PersonnelFormView.displayAddForm} updateLocalPersonnels={(newPersonnel: Personnel) => setPersonnels([...personnels, newPersonnel])} closeModalEventHandler={() => setPersonnelFormView(Status.hidden)} ></AddPersonnelModal>

                {/* Update Personnel */}
                <>{selectedPersonnel ?
                    <UpdatePersonnelModal updatePersonnelEventHandler={updatePersonnelsEventHandler} showModal={showUpdatePersonnelModal && !!selectedPersonnel} personnel={selectedPersonnel} selectedPersonnelUpdateEventHandler={(_updatedPersonnel: PlainPersonnel) => { setSelectedPersonnel(_updatedPersonnel) }} closeModalEventHandler={() => {
                        setSelectedPersonnel(undefined)
                        setShowUpdatePersonnelModal(false)
                    }} ></UpdatePersonnelModal> : ''
                }</>

                {/* Delete Personnel */}
                <>{selectedPersonnel ?
                    <DeletePersonnelModal showModal={personnelFormView === PersonnelFormView.displayDeleteConfirmationFormView} personnel={selectedPersonnel} removePersonnelEventHandler={(personnel: Personnel | PlainPersonnel) => removePersonnelEventHandler(personnel)} closeModalEventHandler={() => setPersonnelFormView(Status.hidden)} ></DeletePersonnelModal> : ''
                }</>
            </DefaultSection>
        </div>
    )
}