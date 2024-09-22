import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from 'idb';
import { storageOptionLabel } from "@/lib/constants/enum";
import { AppOptionSchema, appOptionStoreName, customerStoreName, personnelStoreName, projectStoreName, siteStoreName, timesheetDatabaseName, timesheetStoreName } from "@/lib/constants/schema";
import { DefaultPrimitiveTimesheetEntryDataInterface as DefaultTimesheetEntryDataInterface } from "@/lib/types/timesheetType";

const databaseVersion = 1;
const readWriteFlag = "readwrite"
// let _db: IDBDatabase;

export const initalizeDatabase = (db: IDBDatabase | IDBPDatabase) => {
    if (!db.objectStoreNames.contains(personnelStoreName)) {
        const personnelObjectStore = db.createObjectStore(personnelStoreName, { keyPath: 'id', autoIncrement: true });
        personnelObjectStore.createIndex("slug_index", "name", { unique: true })
        personnelObjectStore.createIndex("name_index", "name", { unique: true })
    }

    if (!db.objectStoreNames.contains(timesheetStoreName)) {
        const timesheetObjectStore = db.createObjectStore(timesheetStoreName, { keyPath: 'id', autoIncrement: true });
        timesheetObjectStore.createIndex("personnelId_index", "personnelId", { unique: false })
        timesheetObjectStore.createIndex("date_index", "date", { unique: false })
    }

    if (!db.objectStoreNames.contains(customerStoreName)) {
        const customerObjectStore = db.createObjectStore(customerStoreName, { keyPath: 'id', autoIncrement: true });
        customerObjectStore.createIndex("slug_index", "slug", { unique: true })
        customerObjectStore.createIndex("name_index", "name", { unique: true })
    }

    if (!db.objectStoreNames.contains(siteStoreName)) {
        const siteObjectStore = db.createObjectStore(siteStoreName, { keyPath: 'id', autoIncrement: true });
        siteObjectStore.createIndex("slug_index", "slug", { unique: true })
        siteObjectStore.createIndex("name_index", "name", { unique: false })
    }

    if (!db.objectStoreNames.contains(projectStoreName)) {
        const projectObjectStore = db.createObjectStore(projectStoreName, { keyPath: 'id', autoIncrement: true });
        projectObjectStore.createIndex("purchaseOrderNumber_index", "purchaseOrderNumber", { unique: true })
    }

    if (!db.objectStoreNames.contains(appOptionStoreName)) {
        const appOptionObjectStore = db.createObjectStore(appOptionStoreName, { keyPath: 'id', autoIncrement: true });
        appOptionObjectStore.createIndex("key_index", "key", { unique: true })
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
    let appOptionStoreObject = _db.transaction(appOptionStoreName, readWriteFlag).objectStore(appOptionStoreName);
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

export const createOrUpdateTimesheetEntryDefaultData = async (timesheetEntryDefaultData: DefaultTimesheetEntryDataInterface) => {
    const _db = await useDb();
    const _transaction = _db.transaction(appOptionStoreName, readWriteFlag)
    const appOptionStoreObject = _transaction.objectStore(appOptionStoreName);
    const keyIndex = appOptionStoreObject.index("key");
    const data = (await keyIndex.get(storageOptionLabel.timesheetEntryDefaultDataLabel)) || undefined;
    if (data) {
        data.value = timesheetEntryDefaultData;
        await appOptionStoreObject.put(data);
    } else {
        await appOptionStoreObject.add({ key: storageOptionLabel.timesheetEntryDefaultDataLabel, value: timesheetEntryDefaultData });
    }

    await _transaction.done;
}

/* export const getTimesheetEntryDefaultData = () => {
    let appOptionStoreObject = _db.transaction(appOptionStoreName, readWriteFlag).objectStore(appOptionStoreName);
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
    const data = await _db.getFromIndex(appOptionStoreName, "key", storageOptionLabel.timesheetEntryDefaultDataLabel);
    return data;
    /* const _transaction = _db.transaction(appOptionStoreName);
    const appOptionStoreObject = _transaction.objectStore(appOptionStoreName);
    const keyIndex = appOptionStoreObject.index("key");
    const data = (await keyIndex.get(storageOptionLabel.timesheetEntryDefaultDataLabel)) || undefined;
    if (data) {
        return data.value;
    } else {
        throw Error;            
    }
 
    await _transaction.done; */
}


