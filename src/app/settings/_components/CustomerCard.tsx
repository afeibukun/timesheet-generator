'use client'
import { useEffect, useState } from "react";
import { updateDataInStore } from "@/lib/services/indexedDB/indexedDBService";
import { Status } from "@/lib/constants/constant";
import DefaultLabelText from "@/app/_components/DefaultLabelText";
import { StoreName } from "@/lib/constants/storage";
import { Site } from "@/lib/services/meta/site";
import { Customer } from "@/lib/services/meta/customer";
import Modal from "@/app/_components/Modal";

type CustomerCardProp = {
    customer: Customer,
    handleUpdateCustomer: Function,
    handleDeleteCustomer: Function
}

export default function CustomerCard({ customer, handleUpdateCustomer, handleDeleteCustomer }: CustomerCardProp) {

    const _initNotification = { active: false, type: '', message: '' }

    type SiteForm = {
        siteName: string,
        siteCountry: string,
        customerSlug: string,
        state: Status,
        notification: any
    }

    const _initSite = { siteName: '', siteCountry: '', customerSlug: customer.slug, state: Status.hideForm, notification: _initNotification }
    const [siteFormForCustomer, setSiteFormForCustomer] = useState(_initSite);

    const enum DisplayLabel {
        none = "",
        addForm = "add-item-form-view",
        deleteForm = "delete-item-form-view",
        deleteConfirmationFormView = "delete-item-confirmation-form-view"
    }

    useEffect(() => {
        const initializer = async () => {
            try {
            } catch (e) { }
        }
        initializer();
    }, []);

    async function handleDeleteCustomerEvent(e: any, customer: Customer) {
        e.preventDefault(); e.stopPropagation();
        if (customer.id) {
            await Customer.deleteCustomer(customer.id);
            handleDeleteCustomer(customer.id);
        }
    }

    async function handleSaveSiteEvent(e: any, customer: Customer) {
        e.preventDefault(); e.stopPropagation();
        if (siteFormForCustomer.siteName && siteFormForCustomer.siteCountry) {
            // Save in DB
            const _updatedCustomer = await Site.createSite(customer, siteFormForCustomer.siteName, siteFormForCustomer.siteCountry)
            handleUpdateCustomer(_updatedCustomer);
            setSiteFormForCustomer({ ..._initSite, state: Status.hideForm, notification: { active: true, type: "success", message: "New Site successfully added" } });
        }
    }

    async function handleDeleteSiteEvent(e: any, site: Site, customer: Customer) {
        e.preventDefault(); e.stopPropagation();
        if (site.slug && customer.sites && customer.sites.length > 0) {
            const updatedCustomer = { ...customer, sites: customer.sites.filter((_site) => _site.slug !== site.slug) }

            // update in DB
            await updateDataInStore(updatedCustomer, customer.id, StoreName.customer);

            handleUpdateCustomer(updatedCustomer);
            setSiteFormForCustomer(_initSite)
        }
    }

    return (
        <div className="customer-card">
            <div className="mb-2">
                <div className="px-2 py-2 bg-slate-100 rounded">
                    <div className="mb-3 flex justify-between items-center">
                        <div>
                            <span className="text-sm">Customer: </span>
                            <span className="font-bold">{customer.name}</span>
                        </div>
                        <div>
                            <button className="px-3 py-1 rounded text-xs text-white bg-red-600" type="button" onClick={(e) => handleDeleteCustomerEvent(e, customer)}>Delete Customer</button>
                        </div>
                    </div>
                    <div>
                        <div className="flex mb-2 gap-x-3 items-center justify-between">
                            <h5 className="text-sm underline">Sites</h5>
                            <button type="button" className="px-2 py-0.5 rounded text-sm bg-blue-600 text-white" onClick={() => setSiteFormForCustomer({ ...siteFormForCustomer, state: Status.displayForm })}>+ Add Site</button>
                        </div>
                        <div className="sites">
                            <div className="grid grid-cols-4">
                                <div><p className="font-bold">S/N</p></div>
                                <div>
                                    <p className="font-bold">Site Name</p>
                                </div>
                                <div>
                                    <p className="font-bold">Site Country</p>
                                </div>
                                <div></div>
                            </div>
                            <div>
                                {customer.sites && customer.sites.length > 0 ? customer.sites.map((_site: Site, index: number) =>
                                    <div key={_site.id} className="grid grid-cols-4">
                                        <div>{index + 1}</div>
                                        <div>
                                            <p>{_site.name}</p>
                                        </div>
                                        <div>
                                            <p>{_site.country}</p>
                                        </div>
                                        <div>
                                            <button type="button" className="px-2 py-0.5 rounded text-xs bg-red-600 text-white" onClick={(e) => handleDeleteSiteEvent(e, _site, customer)}>Delete</button>
                                        </div>
                                    </div>
                                ) : <div className="px-3 py-0.5 bg-slate-200"><p className="text-sm italic">There are no sites yet</p></div>}
                            </div>
                        </div>
                        <Modal showModal={siteFormForCustomer.state === Status.displayForm}
                            modalTitle="Add New Site"
                            modalFooter={<>
                                <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={(e) => handleSaveSiteEvent(e, customer)}>Save</button>
                                <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100" onClick={(e) => setSiteFormForCustomer({ ...siteFormForCustomer, state: Status.hideForm })}>Close</button>
                            </>
                            }
                            closeModalEventHandler={() => setSiteFormForCustomer({ ...siteFormForCustomer, state: Status.hideForm })}
                        >
                            <div className="add-site">
                                <div className="px-2 py-2 border">
                                    <div>
                                        <div>
                                            <label htmlFor={`newSiteName${customer.id}`}>
                                                <DefaultLabelText>New Site Name
                                                </DefaultLabelText>
                                            </label>
                                        </div>
                                        <div>
                                            <input type="text"
                                                name={`newSiteName${customer.id}`}
                                                id={`newSiteName${customer.id}`}
                                                value={siteFormForCustomer.siteName}
                                                onChange={(e) => setSiteFormForCustomer({ ...siteFormForCustomer, siteName: e.target.value })}
                                                className="border rounded" />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div>
                                            <label htmlFor={`newSiteCountry${customer.id}`}>
                                                <DefaultLabelText>New Site Country
                                                </DefaultLabelText>
                                            </label>
                                        </div>
                                        <div>
                                            <input type="text"
                                                name={`newSiteCountry${customer.id}`}
                                                id={`newSiteCountry${customer.id}`}
                                                value={siteFormForCustomer.siteCountry}
                                                onChange={(e) => setSiteFormForCustomer({ ...siteFormForCustomer, siteCountry: e.target.value })}
                                                className="border rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}