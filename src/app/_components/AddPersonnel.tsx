import { useState } from "react";
import DefaultLabelText from "./DefaultLabelText";
import { createPersonnel } from "@/lib/services/indexedDB/indexedDBService";

type AddPersonnelPropType = {
    updateLocalPersonnels?: Function,
    closeForm?: Function,
    shouldCloseOnSave?: boolean
}

export default function AddPersonnel({ updateLocalPersonnels, closeForm, shouldCloseOnSave = false }: AddPersonnelPropType) {
    const [primitivePersonnel, setPrimitivePersonnel] = useState({ personnelName: '' });
    const [notification, setNotification] = useState({ active: false, type: '', message: '' });

    async function handleSavePersonnel(e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (primitivePersonnel.personnelName) {
            // Save in DB
            const newPersonnel = await createPersonnel(primitivePersonnel.personnelName);
            // Save In Local State
            // setPersonnels([...personnels, newPersonnel]);
            if (updateLocalPersonnels) updateLocalPersonnels(newPersonnel);
            setPrimitivePersonnel({ personnelName: '' });
            setNotification({ active: true, type: 'success', message: 'New User Saved Successfully' })
            if (closeForm && shouldCloseOnSave) setTimeout(() => closeForm(), 3000);
            // setPersonnelCreationState(StateEnum.hideForm)
        }
    }

    return (
        <div className=" px-2 py-4 bg-slate-50">
            <div>
                <label htmlFor="newPersonnelName" className="block">
                    <DefaultLabelText>New Personnel Name</DefaultLabelText>
                </label>
            </div>
            <div className="">
                <div className="mb-2">
                    <input type="text"
                        value={primitivePersonnel.personnelName}
                        onChange={(e) => setPrimitivePersonnel({ personnelName: e.target.value })}
                        name="newPersonnelName"
                        id="newPersonnelName"
                        className="inline-block border rounded px-2 py-1" />
                </div>
                <div className="inline-flex gap-2">
                    <button className="px-3 py-1 rounded text-white bg-green-600" type="button" onClick={(e) => handleSavePersonnel(e)}>Submit</button>
                    <button className="px-3 py-1 rounded text-white bg-red-500" type="button" onClick={(e) => { if (closeForm) closeForm() }}>Close</button>
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
    )
}