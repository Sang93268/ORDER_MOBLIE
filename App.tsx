import React, { useState } from "react";
import { Text, View, StyleSheet, FlatList, StatusBar, SafeAreaView, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ban from './src/Ban';
import MonAn from './src/MonAn';

interface Table {
    id: number;
    name: string;
    status: 'available' | 'occupied' | 'reserved';
}

// Định nghĩa kiểu dữ liệu cho navigation stack
type RootStackParamList = {
  Ban: undefined;
  MonAn: { tableId: number; tableName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    const [tables] = useState<Table[]>([
        { id: 1, name: 'Bàn 1', status: 'available' },
        { id: 2, name: 'Bàn 2', status: 'occupied' },
        { id: 3, name: 'Bàn 3', status: 'reserved' },
        { id: 4, name: 'Bàn 4', status: 'available' },
        { id: 5, name: 'Bàn 5', status: 'available' },
        { id: 6, name: 'Bàn 6', status: 'occupied' },
        { id: 7, name: 'Bàn 7', status: 'available' },
        { id: 8, name: 'Bàn 8', status: 'available' },
        { id: 9, name: 'Bàn 9', status: 'available' },
        { id: 10, name: 'Bàn 10', status: 'available' },
        { id: 11, name: 'Bàn 11', status: 'available' },
        { id: 12, name: 'Bàn 12', status: 'available' },
    ]);

    const getTableIcon = (status: string) => {
        switch (status) {
            case 'available': return '🍽️';
            case 'occupied': return '👨‍🍳';
            case 'reserved': return '⏱️';
            default: return '🍽️';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return '#F44336';
            case 'occupied': return '#4CAF50';
            case 'reserved': return '#FFC107';
            default: return '#F44336';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available': return 'Trống';
            case 'occupied': return 'Đang phục vụ';
            case 'reserved': return 'Đã đặt';
            default: return 'Trống';
        }
    };

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Ban">
                <Stack.Screen 
                    name="Ban" 
                    component={Ban} 
                    options={{ title: 'Chọn Bàn' }}
                />
                <Stack.Screen 
                    name="MonAn" 
                    component={MonAn} 
                    options={{ title: 'Chọn Món Ăn' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    tableItem: {
        flex: 1,
        aspectRatio: 1, // Đảm bảo mỗi ô vuông
        borderRadius: 8,
        padding: 15,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    tableName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    tableStatus: {
        fontSize: 12,
        color: 'white',
        marginTop: 5,
    },
    selectedText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    confirmButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default App;
