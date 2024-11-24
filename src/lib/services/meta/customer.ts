import { PlainCustomer } from "@/lib/types/meta";
import { Site } from "./site";
import { createCustomer, deleteDataInStore, getAllCustomers, getFromIndexInStore, updateDataInStore } from "../indexedDB/indexedDBService";
import { IndexName, StoreName } from "@/lib/constants/storage";

export class Customer implements PlainCustomer {
    id: number;
    slug: string;
    name: string;
    activeSite?: Site;
    sites?: Site[]

    constructor({ id, name, slug, sites }: PlainCustomer) {
        if (!id) throw new Error("Invalid Customer")
        this.id = id;
        this.name = name;
        this.slug = slug;

        // plain customers from a database may have sites
        if (sites) {
            this.sites = sites.map((_site) => new Site(_site));
        }
    }

    attachSite(site: Site) {
        this.activeSite = site
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
        const _plainCustomer: PlainCustomer = { id: this.id, slug: this.slug, name: this.name, sites: this.sites };
        await updateDataInStore({ id: this.id, slug: this.slug, name: this.name, sites: this.sites }, this.id, StoreName.customer);
    }

    convertToPlain() {
        return { id: this.id, slug: this.slug, name: this.name } as PlainCustomer
    }

    static async createCustomer(customerName: string) {
        const _newCustomer: PlainCustomer = await createCustomer(customerName);
        return new Customer(_newCustomer);
    }

    static async getAllCustomers() {
        try {
            let _plainCustomers: PlainCustomer[] = await getAllCustomers();
            const _customers = _plainCustomers.map((_plainCustomer) => {
                let _customer = new Customer(_plainCustomer);
                if (_plainCustomer.sites) {
                    const _sites = _plainCustomer.sites.map((_site) => new Site(_site))
                    _customer.addSites(_sites)
                }
                return _customer;
            })
            return _customers;
        } catch (e) { }
        return [] as Customer[]
    }

    static async getCustomerBySlug(slug: string) {
        const _plainCustomer: PlainCustomer = await getFromIndexInStore(StoreName.customer, IndexName.slugIndex, slug);
        let _customer = new Customer(_plainCustomer);
        if (_plainCustomer.sites) {
            const _sites = _plainCustomer.sites.map((_site) => new Site(_site))
            _customer.addSites(_sites);
        }
        return _customer;
    }

    static async deleteCustomer(customerId: number) {
        await deleteDataInStore(customerId, StoreName.customer);
    }

}
