import { useState } from "react"


type ModalProps = {
    children: any,
    showModal: boolean,
    modalTitle: string,
    mainButton?: { label: string, type: string, callback: Function },
    closeButton?: { label: string, type: string, callback: Function },
    closeModalEventHandler: Function,
    modalFooter?: any

}
export default function Modal({ children, showModal, modalTitle, mainButton, closeButton, closeModalEventHandler, modalFooter }: ModalProps) {
    return <>
        {/* Main modal */}
        <div id="default-modal" tabIndex={-1} aria-hidden="true" className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-600/[.4] ${showModal ? '' : 'hidden'}`}>
            <div className="core-modal relative p-4 w-full max-w-2xl max-h-full mx-auto my-40">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow"> {/* dark:bg-gray-700 */}
                    {/* Modal header  */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t"> {/* dark:border-gray-600 */}
                        <h3 className="text-xl font-semibold text-gray-900">{modalTitle}</h3>{/* dark:text-white */}
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal" onClick={(e) => closeModalEventHandler()}> {/* dark:hover:bg-gray-600 dark:hover:text-white */}
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/*  Modal body  */}
                    <div className="p-4 md:p-5 space-y-4">
                        <div>
                            {children}
                        </div>
                    </div>
                    {/* Modal footer */}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b"> {/* dark:border-gray-600 */}
                        <>{modalFooter ?
                            <>{modalFooter}</> : ''
                        }</>
                        <>{mainButton ?
                            <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={(e) => mainButton.callback(e)}>{mainButton.label}</button> /* dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 */
                            : ''
                        }</>

                        <>{closeButton ?
                            <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100" onClick={(e) => closeButton.callback(e)}>{closeButton.label}</button> /* dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 */
                            : ''
                        }</>
                    </div>
                </div>
            </div>
        </div>
    </>
}
