import * as SQLite from 'expo-sqlite';
import { useState } from 'react';

const db = SQLite.openDatabase('budgets-db.db');

const tableName = 'budgets';

export function useBudgetsDb() {
    const [items, setItems] = useState([]);

    function createTable() {
        db.transaction((tx) => {
            let query = `CREATE TABLE IF NOT EXISTS ${tableName} (
                id INTEGER PRIMARY KEY,
                type TEXT,
                amount INTEGER,
                text TEXT,
                date TEXT
            );`;
            tx.executeSql(query);
        });
    }

    function deleteTable() {
        db.transaction((tx) => {
            let query = `DROP TABLE ${tableName}`;
            tx.executeSql(query);
        });
    }

    function getItems() {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${tableName}`,
                [],
                (txObj, { rows }) => {
                    setItems(rows._array);
                },
                (txObj, error) => {
                    console.log('err ', error);
                }
            );
        });
    }

    function getItemsByYearAndMonth(year, month) {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${tableName} WHERE date LIKE '${year}-${month}-%'`,
                [],
                (txObj, { rows }) => {
                    setItems(rows._array);
                },
                (txObj, error) => {
                    console.log('err ', error);
                }
            );
        });
    }

    function addItem(item) {
        db.transaction((tx) => {
            let query = `INSERT INTO ${tableName} (type, amount, text, date) values (?, ?, ?, ?)`;
            tx.executeSql(
                query,
                [item.type, item.amount, item.text, item.date],
                (txObj, resultSet) => {

                },
                (txObj, error) => {
                    console.log('error inserting', error);
                }
            );
        });
    }

    function updateItem(id, item) {
        db.transaction(tx => {
            let query = `UPDATE ${tableName} SET type = ?, amount = ?, text = ?, date = ? WHERE id = ?`;
            tx.executeSql(
                query,
                [item.type, item.amount, item.text, item.date, id],
                (txObj, resultSet) => {
                    
                }
            );
        });
    }

    function deleteItem(id) {
        db.transaction(tx => {
            let query = `DELETE FROM ${tableName} WHERE id = ?`;
            tx.executeSql(
                query,
                [id],
                (txObj, resultSet) => {
                    console.log('deleted')
                }
            );
        });
    }

    return {
        items,
        createTable,
        deleteTable,
        getItems,
        getItemsByYearAndMonth,
        addItem,
        updateItem,
        deleteItem,
    };
}
