import { ErrorMessage } from "@/lib/constants/constant";
import { PlainCustomer, PlainSite } from "@/lib/types/meta";
import { Customer } from "./customer";
import { slugify } from "@/lib/helpers";
import { getFromIndexInStore, updateDataInStore } from "../indexedDB/indexedDBService";
import { IndexName, StoreName } from "@/lib/constants/storage";

export class Site implements PlainSite {
    id: number;
    slug: string;
    name: string;
    country: string;
    description?: string | undefined;

    constructor({ id, name, slug, country, description }: PlainSite) {
        if (!id) throw new Error("Cannot Initialize Site");
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.country = country;
        this.description = description
    }

    convertToPlain() {
        return { id: this.id, name: this.name, slug: this.slug, country: this.country, description: this.description } as PlainSite
    }

    static convertToRawSite(sites: Site[] | PlainSite[], siteSlug: string) {
        if (sites.length == 0) throw Error(ErrorMessage.customerSitesNotFound); //There are no sites for the selected customer, not right  
        let _site: Site | PlainSite = sites.filter(s => s.slug == siteSlug)[0];
        if (!_site) throw Error(ErrorMessage.siteNotValid); // there are sites for the customer, but the one saved on the timesheet Data is not on the site list
        if (_site instanceof Site) return _site
        else return new Site(_site)
    }

    static getSite(sites: Site[] | PlainSite[], siteSlug: string) {
        if (sites.length == 0) throw Error(ErrorMessage.customerSitesNotFound); //There are no sites for the selected customer, not right  
        let _site: Site | PlainSite = sites.filter(s => s.slug == siteSlug)[0];
        if (!_site) throw Error(ErrorMessage.siteNotValid); // there are sites for the customer, but the one saved on the timesheet Data is not on the site list
        if (_site instanceof Site) return _site
        else return new Site(_site)
    }

    static async createSite(customer: Customer, siteName: string, siteCountry: string, siteDescription?: string) {
        // Save in DB
        const siteSlug = slugify(`${siteName} ${siteCountry}`)
        let _site: PlainSite = { id: Date.now(), slug: siteSlug, name: siteName, country: siteCountry };
        if (siteDescription) _site = { ..._site, description: siteDescription };

        const _plainCustomer: PlainCustomer = await getFromIndexInStore(StoreName.customer, IndexName.slugIndex, customer.slug);
        if (_plainCustomer && _plainCustomer.id && _plainCustomer.sites) {
            _plainCustomer.sites = [..._plainCustomer.sites, _site];
            await updateDataInStore(_plainCustomer, _plainCustomer.id, StoreName.customer);
            return _plainCustomer;
        } else throw Error("Invalid Customer Information")
    }
}
