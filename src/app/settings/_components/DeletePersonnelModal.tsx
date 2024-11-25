import { useState } from "react";
import { Personnel } from "@/lib/services/meta/personnel";
import Modal from "@/app/_components/Modal";
import { PlainPersonnel } from "@/lib/types/meta";

type DeletePersonnelPropType = {
    showModal: boolean,
    personnel: PlainPersonnel
    removePersonnelEventHandler: (personnel: Personnel | PlainPersonnel) => {},
    closeModalEventHandler: Function
}

export default function DeletePersonnelModal({ showModal, personnel, removePersonnelEventHandler, closeModalEventHandler }: DeletePersonnelPropType) {
    const [localPersonnel, setLocalPersonnel] = useState(personnel);
    const defaultRemoveFormState = { personnelSlug: '', masterPassword: '', confirmMasterPassword: '', notification: { active: false, type: '', message: '' } };
    const [removePersonnelForm, setRemovePersonnelForm] = useState(defaultRemoveFormState)

    const removePersonnelLocalEventHandler = async () => {
        const _personnelSlug = localPersonnel.slug;
        if (_personnelSlug) {
            // TODO - set the password outside the repo
            if (removePersonnelForm.masterPassword === 'password' && removePersonnelForm.masterPassword === removePersonnelForm.confirmMasterPassword) {
                const _selectedPersonnelSchema = localPersonnel;
                const _name = _selectedPersonnelSchema.name;
                if (_selectedPersonnelSchema.id) {
                    await Personnel.deletePersonnel(_selectedPersonnelSchema.id)
                    setRemovePersonnelForm({ ...defaultRemoveFormState, notification: { active: true, type: 'success', message: `The Personnel (${_name}) has been successfully removed` } })
                    removePersonnelEventHandler(personnel);
                }
            }
        }
    }

    return (
        <Modal showModal={showModal}
            modalTitle="Update Personnel"
            modalFooter={<>
                <>{!removePersonnelForm.notification.active ?
                    <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={(e) => removePersonnelLocalEventHandler()}>Remove Personnel</button> : ''
                }</>
                <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100" onClick={(e) => closeModalEventHandler(e)}>Cancel</button>
            </>
            }
            closeModalEventHandler={() => closeModalEventHandler()}
        >
            <div className="remove-personnel-form-container">
                <div className="remove-personnel">
                    <div className="remove-personnel-confirmation-form px-2 py-4 bg-slate-50">
                        {!removePersonnelForm.notification.active ?
                            <form>
                                <>
                                    {localPersonnel.slug ?
                                        <div className="mb-4">
                                            <p>Are you sure you want to remove <span className="px-1 bg-blue-100">{localPersonnel.name}</span> from your personnel list?</p>
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
                            </form>
                            :
                            <div>
                                <div className="mb-2">
                                    <div className={`px-3 py-2 mt-2 border rounded ${removePersonnelForm.notification.type === 'success' ? 'bg-green-100 border-green-200' : removePersonnelForm.notification.type === 'danger' ? 'bg-red-100 border-red-200' : 'bg-blue-100 border-blue-200'}`}>
                                        <p className={`text-sm font-bold ${removePersonnelForm.notification.type === 'success' ? 'text-green-700' : removePersonnelForm.notification.type === 'danger' ? 'text-red-700' : 'text-blue-700'}`}>{removePersonnelForm.notification.message}</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

        </Modal>
    )
}