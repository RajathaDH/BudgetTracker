import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { BudgetList } from './src/components/budget-list.component';

export default function App() {
    return (
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <BudgetList />
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight
    },
});
