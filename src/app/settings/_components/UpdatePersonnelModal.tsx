import { useState } from "react";
import { createPersonnel } from "@/lib/services/indexedDB/indexedDBService";
import { Personnel } from "@/lib/services/meta/personnel";
import { PersonnelSchema } from "@/lib/types/schema";
import { OptionLabel } from "@/lib/constants/constant";
import { PlainPersonnelOption } from "@/lib/types/meta";
import Modal from "@/app/_components/Modal";
import DefaultLabelText from "@/app/_components/DefaultLabelText";

type UpdatePersonnelPropType = {
    showModal: boolean,
    personnel: PersonnelSchema
    selectedPersonnelUpdateEventHandler: Function,
    updatePersonnelEventHandler: Function,
    closeModalEventHandler: Function
}

export default function UpdatePersonnelModal({ showModal, personnel, selectedPersonnelUpdateEventHandler, updatePersonnelEventHandler, closeModalEventHandler }: UpdatePersonnelPropType) {
    const [notification, setNotification] = useState({ active: false, type: '', message: '' });
    const [newOption, setNewOption] = useState({ key: '', value: '', error: { status: false, message: '' } });

    const personnelOptionsExist = () => {
        return !!personnel.options && Array.isArray(personnel.options) && personnel.options.length > 0
    }

    const updatePersonnelNameEventHandler = (e: any) => {
        const updatedPersonnel = { ...personnel, name: e.target.value }
        selectedPersonnelUpdateEventHandler(updatedPersonnel);
    }

    const updateExistingOptionValueEventHandler = (e: any, existingOption: PlainPersonnelOption) => {
        if (!personnel.options || !Array.isArray(personnel.options)) return //options do not exist
        const updatedPersonnelOptions = personnel.options.map((_opt) => {
            if (_opt.key == existingOption.key) return { key: existingOption.key, value: e.target.value }
            return _opt
        });
        const updatedPersonnel = { ...personnel, options: updatedPersonnelOptions }
        selectedPersonnelUpdateEventHandler(updatedPersonnel);
    }

    const deleteExistingOptionEventHandler = (existingOption: PlainPersonnelOption) => {
        if (!personnel.options || !Array.isArray(personnel.options)) return //options do not exist
        const updatedOptions = personnel.options?.filter((_option) => _option.key != existingOption.key)
        const _updatedPersonnels = { ...personnel, options: updatedOptions }
        selectedPersonnelUpdateEventHandler(_updatedPersonnels);
    }

    const addNewOptionEventHandler = () => {
        if (newOption.key && newOption.value) {
            const newKeyAlreadyExists = !!personnel.options && Array.isArray(personnel.options) && personnel.options.some((_opt) => _opt.key == newOption.key)
            if (newKeyAlreadyExists) {
                setNewOption({ ...newOption, error: { status: true, message: 'Key Already Exists' } })
                return
            }
            const _updatedPersonnel = { ...personnel, options: Array.isArray(personnel.options) ? [...personnel.options, newOption] : [newOption] }
            selectedPersonnelUpdateEventHandler(_updatedPersonnel);
            setNewOption({ key: '', value: '', error: { status: false, message: '' } })
        }
    }

    return (
        <Modal showModal={showModal}
            modalTitle="Update Personnel"
            modalFooter={<>
                <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={(e) => updatePersonnelEventHandler(e)}>Submit</button>
                <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100" onClick={(e) => closeModalEventHandler(e)}>Close</button>
            </>
            }
            closeModalEventHandler={() => closeModalEventHandler()}
        >
            <div className=" px-2 py-4">
                <div>
                    <div className="mb-4">
                        <div>
                            <label htmlFor="personnelName" className="block">
                                <DefaultLabelText>
                                    <span className="font-bold">Personnel Name</span>
                                </DefaultLabelText>
                            </label>
                        </div>
                        <div className="mb-2">
                            <input type="text"
                                value={personnel.name}
                                onChange={(e) => updatePersonnelNameEventHandler(e)}
                                name="personnelName"
                                id="personnelName"
                                className="inline-block border rounded px-2 py-1" />
                        </div>
                    </div>
                    <div className="">
                        <div>
                            <DefaultLabelText>
                                <span className="font-bold">Personnel Options</span>
                            </DefaultLabelText>
                        </div>
                        {/* Display Existing Personnel Options */}
                        <>{personnelOptionsExist() ?
                            <div>
                                <div className="grid grid-cols-5">
                                    <div className="col-span-2">
                                        <p className="text-xs italic">Key</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs italic">Value</p>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                                <>{personnel.options?.map((option, index) =>
                                    <div className="py-1 bg-slate-100 mb-1 rounded" key={index}>
                                        <div className="grid grid-cols-5 gap-x-2">
                                            <div className="col-span-2">
                                                <input type="text" list="personnelOption"
                                                    value={option.key}
                                                    name={`personnelOptionsKey${index}`}
                                                    id={`personnelOptionsKey${index}`}
                                                    title='Personnel Options Key'
                                                    disabled={true}
                                                    className="inline-block border rounded px-2 py-1 text-sm w-full" />
                                            </div>
                                            <div className="col-span-2">
                                                <input type="text"
                                                    value={option.value}
                                                    onChange={(e) => updateExistingOptionValueEventHandler(e, option)}
                                                    name={`personnelOptionsValue${index}`}
                                                    id={`personnelOptionsValue${index}`}
                                                    title="Personnel Options Value"
                                                    className="inline-block border rounded px-2 py-1 text-sm w-full" />
                                            </div>
                                            <div>
                                                <button type="button" className="px-2 py-1 text-xs italic text-red-500"
                                                    onClick={() => deleteExistingOptionEventHandler(option)}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                )}</>
                            </div> : ''
                        }</>
                        {/* Add New Personnel Options */}
                        <div className="px-3 py-2 bg-cyan-200/20 rounded">
                            <div className="grid grid-cols-5 gap-x-2">
                                <div className="col-span-2">
                                    <p className="text-xs italic">Key</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs italic">Value</p>
                                </div>
                                <div>
                                </div>
                            </div>
                            <div className="grid grid-cols-5 items-center gap-x-2 mb-2">
                                <div className="col-span-2">
                                    <input type="text" list="personnelOption"
                                        value={newOption.key}
                                        onChange={(e) => setNewOption({ ...newOption, key: e.target.value })}
                                        name="newPersonnelOptionKey"
                                        id="newPersonnelOptionKey"
                                        title='New Personnel Option Key'
                                        className="inline-block border rounded px-2 py-1 w-full text-sm" />
                                    <datalist id="personnelOption">
                                        <option value={OptionLabel.personnelCodeA} />
                                        <option value={OptionLabel.personnelCodeB} />
                                        <option value={OptionLabel.costCenter} />
                                        <option value={OptionLabel.approverManager} />
                                    </datalist>
                                </div>
                                <div className="col-span-2">
                                    <input type="text"
                                        value={newOption.value}
                                        onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                                        name="newPersonnelOptionValue"
                                        id="newPersonnelOptionValue"
                                        title="New Personnel Option Value"
                                        className="inline-block border rounded px-2 py-1 w-full text-sm" />
                                </div>
                                <div>
                                    <button type="button" className="bg-cyan-700 px-3 py-1 text-xs text-white rounded " onClick={() => addNewOptionEventHandler()}>Add Option</button>
                                </div>
                            </div>

                            {newOption.error.status ? <div>
                                <p className="inline-block text-xs text-red-600 font-bold italic px-3 py-1 bg-red-100 rounded">{newOption.error.message}</p>
                            </div>
                                : ''}
                        </div>
                    </div>
                    <div>
                        <>{notification.active ?
                            <div className={`px-3 py-2 mt-2 border rounded ${notification.type === 'success' ? 'bg-green-100 border-green-200' : notification.type === 'danger' ? 'bg-red-100 border-red-200' : 'bg-blue-100 border-blue-200'}`}>
                                <p className={`text-sm font-bold ${notification.type === 'success' ? 'text-green-700' : notification.type === 'danger' ? 'text-red-700' : 'text-blue-700'}`}>{notification.message}</p>
                            </div> : ''
                        }</>
                    </div>
                </div>
            </div >
        </Modal>
    )
}