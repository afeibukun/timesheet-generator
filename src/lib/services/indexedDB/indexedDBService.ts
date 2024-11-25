import { openDB, IDBPDatabase } from 'idb';
import { StorageLabel, FieldName, IndexName, StoreName, timesheetDatabaseName } from "@/lib/constants/storage";
import { slugify } from '@/lib/helpers';
import { PlainCustomer, PlainPersonnel, PlainProject, PlainSite } from '@/lib/types/meta';
import { TimesheetDate } from '../timesheet/timesheetDate';
import { PlainDefaultTimesheetData, PlainTimesheet, PlainTimesheetCollection, PlainTimesheetRecord } from '@/lib/types/timesheet';

const databaseVersion = 1;
const readWriteFlag = "readwrite"
// let _db: IDBDatabase;

export const initalizeDatabase = (db: IDBDatabase | IDBPDatabase) => {
    if (!db.objectStoreNames.contains(StoreName.personnel)) {
        const _personnelObjectStore = db.createObjectStore(StoreName.personnel, { keyPath: FieldName.id, autoIncrement: true });
        _personnelObjectStore.createIndex(IndexName.slugIndex, FieldName.slug, { unique: true })
        _personnelObjectStore.createIndex(IndexName.nameIndex, FieldName.name, { unique: true })
    }

    if (!db.objectStoreNames.contains(StoreName.timesheet)) {
        const _timesheetObjectStore = db.createObjectStore(StoreName.timesheet, { keyPath: FieldName.id, autoIncrement: true });
        _timesheetObjectStore.createIndex(IndexName.keyIndex, FieldName.key, { unique: true })
        _timesheetObjectStore.createIndex(IndexName.personnelSlugIndex, FieldName.personnelSlug, { unique: false })
        _timesheetObjectStore.createIndex(IndexName.weekEndingDateIndex, FieldName.weekEndingDateString, { unique: false })
    }

    if (!db.objectStoreNames.contains(StoreName.timesheetCollection)) {
        const _timesheetCollectionObjectStore = db.createObjectStore(StoreName.timesheetCollection, { keyPath: FieldName.id, autoIncrement: true });
        _timesheetCollectionObjectStore.createIndex(IndexName.keyIndex, FieldName.key, { unique: true })
    }

    if (!db.objectStoreNames.contains(StoreName.customer)) {
        const _customerObjectStore = db.createObjectStore(StoreName.customer, { keyPath: FieldName.id, autoIncrement: true });
        _customerObjectStore.createIndex(IndexName.slugIndex, FieldName.slug, { unique: true })
        _customerObjectStore.createIndex(IndexName.nameIndex, FieldName.name, { unique: true })
    }

    if (!db.objectStoreNames.contains(StoreName.project)) {
        const _projectObjectStore = db.createObjectStore(StoreName.project, { keyPath: FieldName.id, autoIncrement: true });
        _projectObjectStore.createIndex(IndexName.purchaseOrderNumberIndex, FieldName.purchaseOrderNumber, { unique: true })
    }

    if (!db.objectStoreNames.contains(StoreName.appOption)) {
        const _appOptionObjectStore = db.createObjectStore(StoreName.appOption, { keyPath: FieldName.id, autoIncrement: true });
        _appOptionObjectStore.createIndex(IndexName.keyIndex, FieldName.key, { unique: true })
    }
}

// export const openIndexDBDatabase = async (successCallBackFunction: any) => {
/* let openRequest = indexedDB.open(timesheetDatabaseName, databaseVersion);
openRequest.onupgradeneeded = function () {
    // triggers if the client had no database
    // ...perform initialization...
    let db = openRequest.result;
    initalizeDatabase(db);
};
openRequest.onerror = function () {
    console.error("Error", openRequest.error);
};
openRequest.onsuccess = function () {
    _db = openRequest.result;
    console.log("Successfully Opened connection to the DB")
    // successCallBackFunction(db);
    // continue working with database using db object
}; */
// }

const useDb = async () => {
    const db = await openDB(timesheetDatabaseName, databaseVersion, {
        upgrade(db) {
            initalizeDatabase(db);
        }
    })
    return db;
}

export const updateDataInStore = async (dataToBeUpdated: any, dataKey: number, storeName: string) => {
    const _db = await useDb();
    const res = await _db.put(storeName, dataToBeUpdated);
    if (res) {
        const updatedData = await _db.get(storeName, dataKey);
        return updatedData
    } else {
        throw Error
    }
}

export const deleteDataInStore = async (dataKey: number, storeName: string) => {
    const _db = await useDb();
    await _db.delete(storeName, dataKey);
}

export const getFromIndexInStore = async (storeName: string, indexName: string, query: any) => {
    const _db = await useDb();
    const data = await _db.getFromIndex(storeName, indexName, query);
    return data;
}

export const getInStore = async (dataKey: any, storeName: string) => {
    const _db = await useDb();
    const data = await _db.get(storeName, dataKey);
    return data;
}

export const getAllInStore = async (storeName: string) => {
    const _db = await useDb();
    const data = await _db.getAll(storeName);
    return data;
}

export const getAllFromIndexInStore = async (storeName: string, indexName: string, query: any) => {
    const _db = await useDb();
    const data = await _db.getAllFromIndex(storeName, indexName, query);
    return data;
}

/* export const createIDBData = async (db: IDBDatabase, storeName: string, data: any) => {
    let transaction = db.transaction(storeName, readWriteFlag);
    let storeObject = transaction.objectStore(storeName);
    let addRequest = storeObject.add(data);

    addRequest.onsuccess = function () { // (4)
        console.log("Data added to the store", addRequest.result);
    };

    addRequest.onerror = function () {
        console.log("Error", addRequest.error);
    };
}

export const createOrUpdateIDBData = async (db: IDBDatabase, storeName: string, data: any) => {
    let transaction = db.transaction(storeName, readWriteFlag);
    let storeObject = transaction.objectStore(storeName);
    let addRequest = storeObject.add(data);

    addRequest.onsuccess = function () { // (4)
        console.log("Data added to the store", addRequest.result);
    };

    addRequest.onerror = function () {
        console.log("Error", addRequest.error);
    };
}

export const getDataIndexDB = async (db: IDBDatabase, storeName: string, searchIndexData: any) => {
    let transaction = db.transaction(storeName, readWriteFlag);
    let storeObject = transaction.objectStore(storeName);

    let getRequest = storeObject.get(searchIndexData);

    getRequest.onsuccess = function (event) {
        const data = getRequest.result;
        console.log("Data added to the store", getRequest.result);
    };

    getRequest.onerror = function () {
        console.log("Error", getRequest.error);
    };
} */

/* export const createOrUpdateTimesheetEntryDefaultData = (timesheetEntryDefaultData: DefaultTimesheetEntryDataInterface, onsuccess: any) => {
    let appOptionStoreObject = _db.transaction(StoreName.appOption, readWriteFlag).objectStore(StoreName.appOption);
    const keyIndex = appOptionStoreObject.index("key");

    let getRequestWithKeyIndex = keyIndex.get(storageOptionLabel.timesheetEntryDefaultDataLabel);

    getRequestWithKeyIndex.onsuccess = (event) => {
        const data = getRequestWithKeyIndex.result;
        data.value = timesheetEntryDefaultData
        const updateRequest = appOptionStoreObject.put(data);
        updateRequest.onsuccess = (event) => {
            // console.log("Data updated on the store", updateRequest.result);
            onsuccess();
        }
    }
    getRequestWithKeyIndex.onerror = (event) => {
        let addRequest = appOptionStoreObject.add({ key: storageOptionLabel.timesheetEntryDefaultDataLabel, value: timesheetEntryDefaultData });
        addRequest.onsuccess = function () { // (4)
            // console.log("Data added to the store", addRequest.result);
            onsuccess();
        };
    }

} */

export const createOrUpdateTimesheetEntryDefaultData = async (timesheetEntryDefaultData: PlainDefaultTimesheetData) => {
    const _db = await useDb();
    const _transaction = _db.transaction(StoreName.appOption, readWriteFlag)
    const appOptionStoreObject = _transaction.objectStore(StoreName.appOption);
    const keyIndex = appOptionStoreObject.index("key_index");
    const data = (await keyIndex.get(StorageLabel.timesheetEntryDefaultDataLabel)) || undefined;
    if (data) {
        data.value = timesheetEntryDefaultData;
        await appOptionStoreObject.put(data);
    } else {
        await appOptionStoreObject.add({ key: StorageLabel.timesheetEntryDefaultDataLabel, value: timesheetEntryDefaultData });
    }

    await _transaction.done;
}

export const createOrUpdateAppOption = async (appOptionLabel: string, appOptionData: any) => {
    const _db = await useDb();
    const _transaction = _db.transaction(StoreName.appOption, readWriteFlag)
    const appOptionStoreObject = _transaction.objectStore(StoreName.appOption);
    const keyIndex = appOptionStoreObject.index("key_index");
    const data = (await keyIndex.get(appOptionLabel)) || undefined;
    if (data) {
        data.value = appOptionData;
        await appOptionStoreObject.put(data);
    } else {
        await appOptionStoreObject.add({ key: appOptionLabel, value: appOptionData });
    }
    await _transaction.done;
}

/* export const getTimesheetEntryDefaultData = () => {
    let appOptionStoreObject = _db.transaction(StoreName.appOption, readWriteFlag).objectStore(StoreName.appOption);
    const keyIndex = appOptionStoreObject.index("key");
 
    let getRequestWithKeyIndex = keyIndex.get(storageOptionLabel.timesheetEntryDefaultDataLabel);
 
    getRequestWithKeyIndex.onsuccess = (event) => {
        const data = getRequestWithKeyIndex.result;
 
        const updateRequest = appOptionStoreObject.put(data);
        updateRequest.onsuccess = (event) => {
            // console.log("Data updated on the store", updateRequest.result);
            onsuccess();
        }
    }
} */

export const getTimesheetEntryDefaultData = async () => {
    const _db = await useDb();
    const data = await _db.getFromIndex(StoreName.appOption, "key_index", StorageLabel.timesheetEntryDefaultDataLabel);
    return data;
}

export const getAppOptionData = async (appOptionLabel: string) => {
    const _db = await useDb();
    const data = await _db.getFromIndex(StoreName.appOption, "key_index", appOptionLabel);
    return data;
}

export const getAllPersonnel = async () => {
    const _db = await useDb();
    const data = await _db.getAll(StoreName.personnel);
    return data;
}

export const createPersonnel = async (personnelName: string) => {
    const _db = await useDb();
    const personnelData: PlainPersonnel = {
        slug: slugify(personnelName),
        name: personnelName,
        options: []
    }
    const personnelKey = await _db.add(StoreName.personnel, personnelData);
    const newPersonnel = await _db.get(StoreName.personnel, personnelKey);
    return newPersonnel
}

export const getAllCustomers = async () => {
    const _db = await useDb();
    const data = await _db.getAll(StoreName.customer);
    return data;
}

export const createCustomer = async (customerName: string) => {
    const _db = await useDb();
    const customerData: PlainCustomer = {
        slug: slugify(customerName),
        name: customerName,
        sites: []
    }
    const customerKey = await _db.add(StoreName.customer, customerData);
    const newCustomer = await _db.get(StoreName.customer, customerKey);
    return newCustomer;
}

export const createSiteForCustomer = async (siteData: PlainSite, customerSlug: string) => {
    const _db = await useDb();
    const customer = await _db.getFromIndex(StoreName.customer, IndexName.slugIndex, customerSlug);
    if (customer) {
        customer.sites = [...customer.sites, siteData];
        await _db.put(StoreName.customer, customer);
        return customer;
    } else throw Error
}

export const getAllProjects = async () => {
    const _db = await useDb();
    const data = await _db.getAll(StoreName.project);
    return data;
}

export const createProject = async (projectData: PlainProject) => {
    const _db = await useDb();
    const projectKey = await _db.add(StoreName.project, projectData);
    const newProject = await _db.get(StoreName.project, projectKey);
    return newProject;
}

export const createTimesheet = async (timesheetData: PlainTimesheet) => {
    const _db = await useDb();
    const timesheetKey = await _db.add(StoreName.timesheet, timesheetData);
    const newTimesheet = await _db.get(StoreName.timesheet, timesheetKey);
    return newTimesheet;
}

export const createTimesheetCollection = async (timesheetCollection: PlainTimesheetCollection) => {
    const _db = await useDb();
    const timesheetCollectionKey = await _db.add(StoreName.timesheetCollection, timesheetCollection);
    const newTimesheetCollection = await _db.get(StoreName.timesheetCollection, timesheetCollectionKey);
    return newTimesheetCollection;
}

export const getTimesheetsInDates = async (timesheetDates: TimesheetDate[]) => {
    const _db = await useDb();
    const tx = _db.transaction(StoreName.timesheet);
    let result: PlainTimesheet[] = []
    for await (const cursor of tx.store) {
        const timesheetSchema: PlainTimesheet = cursor.value;
        const timesheetHasRecordWithinDateRange = timesheetSchema.records?.some((_record) => {
            const isRecordDateWithinTimesheetDates = timesheetDates.some((_timesheetDate) => {
                const _isTimesheetDateSameAsCurrentRecordDate = TimesheetDate.areDateStringsSameDay(_timesheetDate.defaultFormat(), _record.date.date)
                return _isTimesheetDateSameAsCurrentRecordDate
            })
            return isRecordDateWithinTimesheetDates
        })
        if (timesheetHasRecordWithinDateRange) {
            result = [...result, timesheetSchema]
        }
    }
    return result
}

export const getTimesheetRecordsInMonth = async (month: number, year: number) => {
    const _db = await useDb();
    const tx = _db.transaction(StoreName.timesheet);
    let result: PlainTimesheetRecord[] = []
    for await (const cursor of tx.store) {
        const _timesheetSchema: PlainTimesheet = cursor.value;
        const _timesheetRecordInRange = !!_timesheetSchema.records ? _timesheetSchema.records.filter((_record) => {
            const _date = new TimesheetDate(_record.date);
            const isRecordDateInMonth = _date.month == month && _date.year === year
            return isRecordDateInMonth
        }) : []
        result = [...result, ..._timesheetRecordInRange]
    }
    return result
}

export const getTimesheetRecordsInYear = async (year: number) => {
    const _db = await useDb();
    const tx = _db.transaction(StoreName.timesheet);
    let result: PlainTimesheetRecord[] = []
    for await (const cursor of tx.store) {
        const _timesheetSchema: PlainTimesheet = cursor.value;
        const _timesheetRecordInDateRange = !!_timesheetSchema.records ? _timesheetSchema.records.filter((_record) => {
            const _date = new TimesheetDate(_record.date);
            const isRecordDateInYear = _date.year === year
            return isRecordDateInYear
        }) : []
        result = [...result, ..._timesheetRecordInDateRange]
    }
    return result
}


