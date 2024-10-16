import { PlainCustomer } from "@/lib/types/meta";
import { Site } from "./site";
import { CustomerSchema } from "@/lib/types/schema";
import { createCustomer, deleteDataInStore, getAllCustomers, getFromIndexInStore, updateDataInStore } from "../indexedDB/indexedDBService";
import { IndexName, StoreName } from "@/lib/constants/storage";

export class Customer implements PlainCustomer {
    id: number;
    slug: string;
    name: string;
    sites?: Site[]

    constructor({ id, name, slug }: PlainCustomer) {
        this.id = id;
        this.name = name;
        this.slug = slug;
    }

    addSites(sites: Site[]) {
        this.sites = sites.map((_site) => new Site(_site));
    }

    removeSites() {
        this.sites = undefined;
    }

    async update() {
        //check if sites is included
        if (!this.sites) throw new Error("Sites Not Included");
        const _sitesRaw = this.sites.map((_site) => { })
        const _customerSchema: CustomerSchema = { id: this.id, slug: this.slug, name: this.name, sites: this.sites };
        await updateDataInStore({ id: this.id, slug: this.slug, name: this.name, sites: this.sites }, this.id, StoreName.customer);
    }

    convertToPlain() {
        return { id: this.id, slug: this.slug, name: this.name } as PlainCustomer
    }

    static async createCustomer(customerName: string) {
        const _newCustomer: CustomerSchema = await createCustomer(customerName);
        return Customer.convertSchemaToCustomer(_newCustomer);
    }

    static async getAllCustomers() {
        try {
            let _customerSchemas: CustomerSchema[] = await getAllCustomers();
            const _customers = _customerSchemas.map((_customerSchema) => {
                let _customer = Customer.convertSchemaToCustomer(_customerSchema);
                const _sites = _customerSchema.sites.map((_site) => new Site(_site))
                _customer.addSites(_sites)
                return _customer;
            })
            return _customers;
        } catch (e) { }
        return [] as Customer[]
    }

    static async getCustomerBySlug(slug: string) {
        const _customerSchema: CustomerSchema = await getFromIndexInStore(StoreName.customer, IndexName.slugIndex, slug);
        let _customer = Customer.convertSchemaToCustomer(_customerSchema);
        const _sites = _customerSchema.sites.map((_site) => new Site(_site))
        _customer.addSites(_sites);
        return _customer;
    }

    static convertSchemaToCustomer(customerSchemaObject: CustomerSchema) {
        if (customerSchemaObject.id) {
            const customer: Customer = new Customer({ id: customerSchemaObject.id, name: customerSchemaObject.name, slug: customerSchemaObject.slug });
            return customer
        }
        throw new Error('Customer Schema Cannot Be Converted To Customer Object');
    }

    static async deleteCustomer(customerId: number) {
        await deleteDataInStore(customerId, StoreName.customer);
    }

}
