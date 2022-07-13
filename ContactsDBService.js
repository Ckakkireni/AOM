import { openDatabase, enablePromise } from 'react-native-sqlite-storage';
import { NativeModules } from 'react-native';


enablePromise(true);

/* export const getConnection = async  () => {

    const db = await openDbConnection();
    console.log(db);
    return db;
}

export const openDBConnection = async () => {
    return await openDatabase({ name: "ContactsDB", createFromLocation:'~ app_update.sqlite',location:'default'});
} */

export const getConnection = async  () => {

    const db = await openDbConnection();
    console.log(db);
    return db;
}

export const openDbConnection = async () => {
    console.log("openDbConnection")
    return await openDatabase({name: "contactsDB", location: 'default'});
}

//var db = SQLite.openDatabase("test.db", "1.0", "Test Database", 200000, openCB, errorCB);

export const createTable = async (db) => {
    try {
        const query = `CREATE TABLE IF NOT EXISTS CONTACTS
                (name TEXT, mobile TEXT, email TEXT)`;

        await db.executeSql(query);
    } catch (error) {
        console.log("Create Table Error", error);
    }

}

export const saveContact = async (db, contact) => {
    try {
        const query = `INSERT INTO CONTACTS(name, mobile, email) 
        values ('${contact.name}', '${contact.mobile}', '${contact.email}')`;
        return await db.executeSql(query);
        

    } catch (error) {
        console.log("saveContact Error", error);
    }
}

export const fetchContacts = async (db) => {
    const contacts = [];
    try {
        
        const results = await db.executeSql("SELECT name, mobile, email FROM CONTACTS");
        console.log("fetchContacts results", results);
        results.forEach(result => {
            for (let index = 0; index < result.rows.length; index++) {
                const row = result.rows.item(index);
                contacts.push(row) ;
                
            }
        })
        return contacts;

    } catch (error) {
        console.log("fetchContacts error", error);
    }
}