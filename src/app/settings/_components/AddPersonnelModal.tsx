import { useState } from "react";
import { createPersonnel } from "@/lib/services/indexedDB/indexedDBService";
import Modal from "../../_components/Modal";

type AddPersonnelPropType = {
    showModal: boolean,
    closeModalEventHandler: Function,
    updateLocalPersonnels?: Function,
    shouldCloseOnSave?: boolean
}

export default function AddPersonnelModal({ showModal, updateLocalPersonnels, closeModalEventHandler, shouldCloseOnSave = false }: AddPersonnelPropType) {
    const [primitivePersonnel, setPrimitivePersonnel] = useState({ personnelName: '' });
    const [notification, setNotification] = useState({ active: false, type: '', message: '' });

    async function savePersonnelEventHandler(e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (primitivePersonnel.personnelName) {
            // Save in DB
            const newPersonnel = await createPersonnel(primitivePersonnel.personnelName);
            if (updateLocalPersonnels) updateLocalPersonnels(newPersonnel);
            setPrimitivePersonnel({ personnelName: '' });
            setNotification({ active: true, type: 'success', message: 'New User Saved Successfully' })
            if (closeModalEventHandler && shouldCloseOnSave) setTimeout(() => closeModalEventHandler(), 3000);
            // setPersonnelCreationState(StateEnum.hideForm)
        }
    }

    return (
        <Modal showModal={showModal}
            modalTitle="Add New Personnel"
            modalFooter={<>
                <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={(e) => savePersonnelEventHandler(e)}>Submit</button>
                <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100" onClick={(e) => closeModalEventHandler(e)}>Close</button>
            </>
            }
            closeModalEventHandler={() => closeModalEventHandler()}
        >
            <div className=" px-2 py-2 bg-slate-50">
                <div className="">
                    <div className="mb-2">
                        <div>
                            <label htmlFor="newPersonnelName">Personnel Name</label>
                        </div>
                        <input type="text"
                            value={primitivePersonnel.personnelName}
                            onChange={(e) => setPrimitivePersonnel({ personnelName: e.target.value })}
                            name="newPersonnelName"
                            id="newPersonnelName"
                            className="inline-block border rounded px-2 py-1" />
                    </div>
                    <>
                        {notification.active ?
                            <div className={`px-3 py-2 mt-2 border rounded ${notification.type === 'success' ? 'bg-green-100 border-green-200' : notification.type === 'danger' ? 'bg-red-100 border-red-200' : 'bg-blue-100 border-blue-200'}`}>
                                <p className={`text-sm font-bold ${notification.type === 'success' ? 'text-green-700' : notification.type === 'danger' ? 'text-red-700' : 'text-blue-700'}`}>{notification.message}</p>
                            </div> :
                            ''}
                    </>

                </div>
            </div>
        </Modal>
    )
}