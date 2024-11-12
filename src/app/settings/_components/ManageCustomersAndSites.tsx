'use client'
import { useEffect, useState } from "react";
import { Status } from "@/lib/constants/constant";
import DefaultSection from "@/app/_components/DefaultSection";
import DefaultSectionHeader from "@/app/_components/DefaultSectionHeader";
import DefaultSectionTitle from "@/app/_components/DefaultSectionTitle";
import DefaultLabelText from "@/app/_components/DefaultLabelText";
import CustomerCard from "./CustomerCard";
import { Customer } from "@/lib/services/meta/customer";
import Modal from "@/app/_components/Modal";

export default function ManageCustomersAndSites() {

    const _initNotification = { active: false, type: '', message: '' }
    const [customers, setCustomers] = useState([] as Customer[]);

    const _initCustomer = { customerName: '', state: Status.hideForm, notification: _initNotification };
    const [customerForm, setCustomerForm] = useState(_initCustomer);

    type SiteForm = {
        siteName: string,
        siteCountry: string,
        customerSlug: string,
        state: Status,
        notification: any
    }

    const enum DisplayLabel {
        none = "",
        addForm = "add-item-form-view",
        deleteForm = "delete-item-form-view",
        deleteConfirmationFormView = "delete-item-confirmation-form-view"
    }

    useEffect(() => {
        const initializer = async () => {
            try {
                let _customers = await Customer.getAllCustomers();
                setCustomers(_customers);
            } catch (e) { }
        }
        initializer();
    }, []);

    async function handleSaveCustomerEvent(e: any) {
        e.preventDefault(); e.stopPropagation();
        if (customerForm.customerName) {
            // Save in DB
            const _newCustomer = await Customer.createCustomer(customerForm.customerName);
            // Save In Local State
            setCustomers([...customers, _newCustomer]);
            setCustomerForm({ ..._initCustomer, state: Status.hideForm, notification: { active: true, type: "success", message: "New Customer Saved Successfully" } });
        }
    }

    function handleUpdateCustomerFromLocalList(updatedCustomer: Customer) {
        const _updatedCustomers = customers.map((_customer) => {
            if (_customer.slug === updatedCustomer.slug) {
                return updatedCustomer
            } else return _customer
        })
        setCustomers(_updatedCustomers);
    }

    function handleDeleteCustomerFromLocalList(customerId: number) {
        setCustomers(customers.filter((_customer) => _customer.id !== customerId));
    }


    return (
        <div className="customer-site-management">
            <DefaultSection>
                <div className="py-3">
                    <DefaultSectionHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <DefaultSectionTitle>Manage Customer / Sites</DefaultSectionTitle>
                            </div>
                            <div>
                                <button type="button" className="px-3 py-2 rounded bg-blue-600 text-white" onClick={() => setCustomerForm({ ...customerForm, state: Status.displayForm })}>Add New Customer</button>
                            </div>
                        </div>
                    </DefaultSectionHeader>
                    <div>
                        <div className="customers">
                            <div className="">
                                {customers.length > 0 ? customers.map((_customer) =>
                                    <div key={_customer.id}>
                                        <CustomerCard
                                            customer={_customer}
                                            handleUpdateCustomer={(updatedCustomer: Customer) => handleUpdateCustomerFromLocalList(updatedCustomer)}
                                            handleDeleteCustomer={(customerId: number) => handleDeleteCustomerFromLocalList(customerId)} />
                                    </div>
                                ) :
                                    <div className="mb-2">
                                        <div className="py-3 px-2 text-center rounded bg-slate-100">
                                            <p className="text-slate-400">No Customers Saved Yet</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <Modal showModal={customerForm.state === Status.displayForm}
                            modalTitle="Add New Customer"
                            modalFooter={<>
                                <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={(e) => handleSaveCustomerEvent(e)}>Save Customer</button>
                                <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100" onClick={(e) => setCustomerForm({ ...customerForm, state: Status.hideForm })}>Close</button>
                            </>
                            }
                            closeModalEventHandler={() => setCustomerForm({ ...customerForm, state: Status.hideForm })}
                        >
                            <div className="add-customer">
                                <div className="border px-2 py-4 rounded-sm">

                                    <div className="mb-2">
                                        <label htmlFor="newCustomerName">
                                            <DefaultLabelText>New Customer Name
                                            </DefaultLabelText>
                                        </label>
                                    </div>
                                    <div className="mb-3">
                                        <input type="text"
                                            name="newCustomerName"
                                            id="newCustomerName"
                                            value={customerForm.customerName}
                                            onChange={(e) => setCustomerForm({ ...customerForm, customerName: e.target.value })}
                                            className="border rounded" />
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </DefaultSection>
        </div>
    )
}