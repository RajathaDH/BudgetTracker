import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
    TextInput,
    Button,
    RadioButton,
    Chip,
    DataTable
} from 'react-native-paper';
import { useBudgetsDb } from '../hooks/use-db.hook';

const BUDGET_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense'
};

const months = [
    { value: 1, text: 'January' },
    { value: 2, text: 'February' },
    { value: 3, text: 'March' },
    { value: 4, text: 'April' },
    { value: 5, text: 'May' },
    { value: 6, text: 'June' },
    { value: 7, text: 'July' },
    { value: 8, text: 'August' },
    { value: 9, text: 'September' },
    { value: 10, text: 'October' },
    { value: 11, text: 'November' },
    { value: 12, text: 'December' }
];

const startYear = 2022;
let years = [];

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth() + 1;

for (let i = startYear; i <= currentYear; i++) {
    years.push(i);
}

export function BudgetList() {
    const [type, setType] = useState(BUDGET_TYPES.INCOME);
    const [amount, setAmount] = useState(0);
    const [text, setText] = useState('');
    const [filterYear, setFilterYear] = useState(currentYear);
    const [filterMonth, setFilterMonth] = useState(currentMonth);
    const { items, createTable, deleteTable, getItems, getItemsByYearAndMonth, addItem, deleteItem } = useBudgetsDb();

    const incomeItems = items.filter((item) => item.type === BUDGET_TYPES.INCOME);
    const expenseItems = items.filter((item) => item.type === BUDGET_TYPES.EXPENSE);
    const totalIncomeForMonth = incomeItems.reduce((total, item) => total + item.amount, 0);
    const totalExpenseForMonth = expenseItems.reduce((total, item) => total + item.amount, 0);

    useEffect(() => {
        createTable();
        // deleteTable();
    }, []);

    useEffect(() => {
        getItemsByYearAndMonth(filterYear, filterMonth);
    }, [filterYear, filterMonth]);

    function onAddItem() {
        let currentDate = new Date();
        // let date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        let date = '2022-12-23';

        addItem({
            type: type,
            amount: amount,
            text: text,
            date: date
        });

        setAmount(0);
        setText('');
    }

    function onDeleteItem(id) {
        deleteItem(id);
    }

    return (
        <ScrollView style={styles.container}>
            <View>
                <TextInput
                    label="Amount"
                    value={amount}
                    onChangeText={(value) => setAmount(value)}
                />

                <TextInput
                    label="Text"
                    value={text}
                    onChangeText={(value) => setText(value)}
                />
            </View>

            <View>
                <RadioButton.Group onValueChange={(value) => setType(value)} value={type}>
                    <RadioButton.Item label="Income" value={BUDGET_TYPES.INCOME} />
                    <RadioButton.Item label="Expense" value={BUDGET_TYPES.EXPENSE} />
                </RadioButton.Group>
            </View>

            <View>
                <Button
                    mode="contained"
                    onPress={() => {
                        onAddItem();
                    }}
                >
                    Add
                </Button>
            </View>

            <View>
                <Button
                    mode="contained"
                    onPress={() => {
                        getItems();
                    }}
                >
                    Refresh
                </Button>
            </View>

            <ScrollView style={styles.filterContainer} horizontal>
                {years.map((year) => (
                    <Chip
                        key={year}
                        mode={filterYear === year ? 'flat' : 'outlined'}
                        style={styles.filterChip} onPress={() => setFilterYear(year)}
                    >
                        {year}
                    </Chip>
                ))}
            </ScrollView>

            <ScrollView style={styles.filterContainer} horizontal>
                {months.map((month) => (
                    <Chip
                        key={month.value}
                        mode={filterMonth === month.value ? 'flat' : 'outlined'}
                        style={styles.filterChip} onPress={() => setFilterMonth(month.value)}
                    >
                        {month.text}
                    </Chip>
                ))}
            </ScrollView>

            <View style={[styles.itemContainer, styles.itemContainerIncome]}>
                <View style={styles.itemContainerHeader}>
                    <Text style={styles.itemContainerHeaderText}>Income: {totalIncomeForMonth}</Text>
                </View>

                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Text</DataTable.Title>
                        <DataTable.Title>Amount</DataTable.Title>
                        <DataTable.Title numeric>Date</DataTable.Title>
                        <DataTable.Title numeric>Remove</DataTable.Title>
                    </DataTable.Header>

                    {incomeItems.map((item) => (
                        <DataTable.Row key={item.id}>
                            <DataTable.Cell>{item.text}</DataTable.Cell>
                            <DataTable.Cell>{item.amount}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.date}</DataTable.Cell>
                            <DataTable.Cell numeric>
                                <TouchableOpacity
                                    style={styles.itemDeleteIcon}
                                    onLongPress={() => {
                                        onDeleteItem(item.id);
                                    }}
                                    delayLongPress={1000}
                                >
                                    <Text>X</Text>
                                </TouchableOpacity>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </View>

            <View style={[styles.itemContainer, styles.itemContainerExpense]}>
                <View style={styles.itemContainerHeader}>
                    <Text style={styles.itemContainerHeaderText}>Expense: {totalExpenseForMonth}</Text>
                </View>

                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Text</DataTable.Title>
                        <DataTable.Title>Amount</DataTable.Title>
                        <DataTable.Title numeric>Date</DataTable.Title>
                        <DataTable.Title numeric>Remove</DataTable.Title>
                    </DataTable.Header>

                    {expenseItems.map((item) => (
                        <DataTable.Row key={item.id}>
                            <DataTable.Cell>{item.text}</DataTable.Cell>
                            <DataTable.Cell>{item.amount}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.date}</DataTable.Cell>
                            <DataTable.Cell numeric>
                                <TouchableOpacity
                                    style={styles.itemDeleteIcon}
                                    onLongPress={() => {
                                        onDeleteItem(item.id);
                                    }}
                                    delayLongPress={1000}
                                >
                                    <Text>X</Text>
                                </TouchableOpacity>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 4
    },
    filterContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 2
    },
    filterChip: {
        margin: 2
    },
    itemContainer: {
        margin: 2,
        padding: 4,
        borderRadius: 4
    },
    itemContainerHeader: {
        backgroundColor: '#facc15',
        padding: 2,
        borderRadius: 4
    },
    itemContainerHeaderText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    itemContainerIncome: {
        backgroundColor: '#4ade80'
    },
    itemContainerExpense: {
        backgroundColor: '#60a5fa'
    },
    itemCard: {
        marginVertical: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemDeleteIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ef4444',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
