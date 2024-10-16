'use client'
import { PersonnelSchema } from "@/lib/types/schema";
import { useEffect, useState } from "react";
import AddPersonnel from "../../_components/AddPersonnel";
import { Personnel } from "@/lib/services/meta/personnel";
import { getAllPersonnel } from "@/lib/services/indexedDB/indexedDBService";
import DefaultSection from "../../_components/DefaultSection";
import DefaultSectionHeader from "../../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../../_components/DefaultSectionTitle";
import ActivePersonnel from "../../_components/ActivePersonnel";
import { Status } from "@/lib/constants/constant";
import { PersonnelInterface } from "@/lib/types/meta";

export default function ManagePersonnel() {
    const [personnels, setPersonnels] = useState([] as PersonnelSchema[]);
    const [primitiveActivePersonnel, setPrimitiveActivePersonnel] = useState({ displayForm: false, personnelSlug: '' })
    const [localActivePersonnel, setLocalActivePersonnel] = useState({} as Personnel)

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
                let _personnels: PersonnelSchema[] = await getAllPersonnel();
                setPersonnels(_personnels);

                try {
                    const _activePersonnel = await Personnel.getActivePersonnel();
                    setLocalActivePersonnel(_activePersonnel);
                } catch (e) { }

            } catch (e) { }
        }
        initializer();
    }, []);

    const handleSaveActivePersonnel = async (newActivePersonnel: PersonnelSchema) => {
        if (!!newActivePersonnel.slug) {
            const _selectedPersonnelSchema = personnels.filter(p => p.slug === newActivePersonnel.slug)[0];
            if (_selectedPersonnelSchema.id) {
                const _selectedPersonnelInterface = _selectedPersonnelSchema as PersonnelInterface
                const _selectedPersonnel: Personnel = new Personnel(_selectedPersonnelInterface);
                await Personnel.saveActivePersonnel(_selectedPersonnel)
                setLocalActivePersonnel(_selectedPersonnel);
            }
        }
    }

    const handleInitiateDeletePersonnel = (personnel: PersonnelSchema) => {
        setRemovePersonnelForm({ ...removePersonnelForm, personnelSlug: personnel.slug })
        setPersonnelFormView(PersonnelFormView.displayDeleteConfirmationFormView);
    }

    const handleRemovePersonnel = async () => {
        const _personnelSlug = removePersonnelForm.personnelSlug;
        if (_personnelSlug) {
            // TODO - set the password outside the repo
            if (removePersonnelForm.masterPassword === 'password' && removePersonnelForm.masterPassword === removePersonnelForm.confirmMasterPassword) {
                const _selectedPersonnelSchema = personnels.filter(p => p.slug === _personnelSlug)[0];
                const _name = _selectedPersonnelSchema.name;
                if (_selectedPersonnelSchema.id) {
                    await Personnel.deletePersonnel(_selectedPersonnelSchema.id)
                    setRemovePersonnelForm({ ...defaultRemoveFormState, notification: { active: true, type: 'success', message: `The Personnel (${_name}) has been successfully removed` } })

                    setPersonnels(personnels.filter((_personnel) => _personnel.id !== _selectedPersonnelSchema.id));
                    if (localActivePersonnel.slug === _personnelSlug) {
                        setLocalActivePersonnel({} as Personnel);
                    }
                }
            }
        }
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
                <div className="add-personnel">
                    {personnelFormView === PersonnelFormView.displayAddForm ?
                        <div className="add-personnel mb-2">
                            <div className="add-personnel-display">
                                <AddPersonnel updateLocalPersonnels={(newPersonnel: Personnel) => setPersonnels([...personnels, newPersonnel])} closeForm={() => setPersonnelFormView(Status.hidden)} />
                            </div>
                        </div>
                        : ''
                    }
                </div>
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
                            <div className="grid grid-cols-3 px-2 py-1 rounded font-bold text-sm bg-slate-50">
                                <div><h4>S/N</h4></div>
                                <div><h4>Personnel Name</h4></div>
                                <div></div>
                            </div>
                            <>
                                {personnels.map((_personnel, index) =>
                                    <div key={_personnel.id} className="px-2 odd:bg-blue-100">
                                        <div className="grid grid-cols-3 py-0.5 items-center">
                                            <div><p>{index + 1}</p></div>
                                            <div>
                                                <p className="">
                                                    <span className="inline-block mr-1">{_personnel.name}</span>
                                                    <>{_personnel.slug === localActivePersonnel.slug ? <span className="px-2 py-0.5 rounded text-emerald-100 bg-emerald-600 text-xs">Active</span> : ''}</>
                                                </p>
                                            </div>
                                            <div className="flex gap-x-1 justify-end">
                                                <>{_personnel.slug !== localActivePersonnel.slug ? <button type="button" className="px-2 py-0.5 text-xs bg-emerald-700 text-white rounded" onClick={(e) => handleSaveActivePersonnel(_personnel)}>Make Active Personnel</button> : ''}</>
                                                <button type="button" className="px-2 py-0.5 text-xs bg-red-600 text-white rounded" onClick={() => handleInitiateDeletePersonnel(_personnel)}>Delete</button>
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
                <div className="remove-personnel-form-container">
                    <div className="remove-personnel">
                        <>
                            {personnelFormView === PersonnelFormView.displayDeleteConfirmationFormView ?
                                <div className="remove-personnel-confirmation-form px-2 py-4 bg-slate-50">
                                    {!removePersonnelForm.notification.active ?
                                        <form>
                                            <>
                                                {removePersonnelForm.personnelSlug && personnels.some((p) => p.slug === removePersonnelForm.personnelSlug) ?
                                                    <div className="mb-4">
                                                        <p>Are you sure you want to remove <span className="px-1 bg-blue-100">{personnels.filter((_personnel) => _personnel.slug === removePersonnelForm.personnelSlug)[0].name}</span> from your personnel list?</p>
                                                    </div>
                                                    : ''}
                                            </>
                                            <div className="mb-1">
                                                <label htmlFor="masterPassword">Verify with the Master Password to remove the Personnel</label>
                                            </div>
                                            <div className="mb-2">
                                                <div>
                                                    <div><label htmlFor="masterPassword" className="text-sm">Master Password</label></div>
                                                    <input type="password"
                                                        name="masterPassword"
                                                        id="masterPassword"
                                                        className="inline-block border rounded" autoComplete="true" value={removePersonnelForm.masterPassword} onChange={(e) => setRemovePersonnelForm({ ...removePersonnelForm, masterPassword: e.target.value })} />
                                                </div>
                                                <div>
                                                    <div><label htmlFor="confirmMasterPassword" className="text-sm">Confirm Master Password</label></div>
                                                    <input type="password"
                                                        name="confirmMasterPassword"
                                                        id="confirmMasterPassword"
                                                        className="inline-block border rounded" autoComplete="true" value={removePersonnelForm.confirmMasterPassword} onChange={(e) => setRemovePersonnelForm({ ...removePersonnelForm, confirmMasterPassword: e.target.value })} />
                                                </div>
                                            </div>

                                            <div className="inline-flex gap-2">
                                                <button className="px-3 py-1 rounded text-white bg-red-600" type="button" onClick={(e) => handleRemovePersonnel()}>Remove Personnel</button>
                                                <button className="px-3 py-1 rounded text-red-600 " type="button" onClick={(e) => setPersonnelFormView(Status.hidden)}>Cancel</button>
                                            </div>
                                        </form>
                                        :
                                        <div>
                                            <div className="mb-2">
                                                <div className={`px-3 py-2 mt-2 border rounded ${removePersonnelForm.notification.type === 'success' ? 'bg-green-100 border-green-200' : removePersonnelForm.notification.type === 'danger' ? 'bg-red-100 border-red-200' : 'bg-blue-100 border-blue-200'}`}>
                                                    <p className={`text-sm font-bold ${removePersonnelForm.notification.type === 'success' ? 'text-green-700' : removePersonnelForm.notification.type === 'danger' ? 'text-red-700' : 'text-blue-700'}`}>{removePersonnelForm.notification.message}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <button type="button" className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => {
                                                    setPersonnelFormView(Status.hidden)
                                                    setRemovePersonnelForm(defaultRemoveFormState);
                                                }}>Close</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                                : ''
                            }
                        </>
                    </div>
                </div>
            </DefaultSection>
        </div>
    )
}