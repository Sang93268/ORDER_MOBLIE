import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList, StatusBar, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Định nghĩa kiểu navigation
type RootStackParamList = {
    Ban: undefined;
    MonAn: { tableId: number; tableName: string };
};

type BanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Ban'>;

interface Table {
    id: number;
    name: string;
    status: 'available' | 'occupied' | 'reserved';
}

const Ban = () => {
    const navigation = useNavigation<BanScreenNavigationProp>();
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [filter, setFilter] = useState<'all' | 'available' | 'occupied' | 'reserved'>('all');

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

    // Lọc bàn theo trạng thái
    const filteredTables = filter === 'all' 
        ? tables 
        : tables.filter(table => table.status === filter);

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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    <TouchableOpacity 
                        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]} 
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>Tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.filterButton, filter === 'available' && styles.filterButtonActive]} 
                        onPress={() => setFilter('available')}
                    >
                        <Text style={[styles.filterText, filter === 'available' && styles.filterTextActive]}>Bàn trống</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.filterButton, filter === 'occupied' && styles.filterButtonActive]} 
                        onPress={() => setFilter('occupied')}
                    >
                        <Text style={[styles.filterText, filter === 'occupied' && styles.filterTextActive]}>Đang phục vụ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.filterButton, filter === 'reserved' && styles.filterButtonActive]} 
                        onPress={() => setFilter('reserved')}
                    >
                        <Text style={[styles.filterText, filter === 'reserved' && styles.filterTextActive]}>Đã đặt</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
                    <Text style={styles.legendText}>Trống</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.legendText}>Đang phục vụ</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
                    <Text style={styles.legendText}>Đã đặt</Text>
                </View>
            </View>

            {filteredTables.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Không có bàn nào phù hợp với lựa chọn</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredTables}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.tableList}
                    renderItem={({ item }) => (
                        <View style={styles.tableWrapper}>
                            <TouchableOpacity
                                style={[
                                    styles.tableItem, 
                                    { borderColor: getStatusColor(item.status) },
                                    selectedTable?.id === item.id && styles.selectedTableItem
                                ]}
                                onPress={() => setSelectedTable(item)}
                            >
                                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
                                <Text style={styles.tableIcon}>{getTableIcon(item.status)}</Text>
                                <Text style={styles.tableName}>{item.name}</Text>
                                <Text style={[styles.tableStatus, { color: getStatusColor(item.status) }]}>
                                    {getStatusText(item.status)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {selectedTable && (
                <View style={styles.footer}>
                    <View style={styles.selectedInfo}>
                        <Text style={styles.selectedLabel}>Bàn đã chọn:</Text>
                        <Text style={styles.selectedText}>{selectedTable.name}</Text>
                        <Text style={[styles.selectedStatus, { color: getStatusColor(selectedTable.status) }]}>
                            {getStatusText(selectedTable.status)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => {
                            navigation.navigate('MonAn', {
                                tableId: selectedTable.id,
                                tableName: selectedTable.name
                            });
                        }}
                    >
                        <Text style={styles.confirmButtonText}>Gọi món</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    filterContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        marginBottom: 5,
    },
    filterScroll: {
        paddingHorizontal: 10,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    filterButtonActive: {
        backgroundColor: '#2196F3',
    },
    filterText: {
        fontSize: 14,
        color: '#555',
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginBottom: 5,
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
    tableList: {
        paddingHorizontal: 8,
        paddingVertical: 2
    },
    tableWrapper: {
        width: '33.33%',
        padding: 4,
    },
    tableItem: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        position: 'relative',
    },
    selectedTableItem: {
        borderWidth: 3,
        shadowOpacity: 0.3,
        elevation: 4,
    },
    statusIndicator: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    tableIcon: {
        fontSize: 28,
        marginBottom: 6,
    },
    tableName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    tableStatus: {
        fontSize: 12,
        fontWeight: '500',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    selectedInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    selectedLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 6,
    },
    selectedText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    selectedStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
export default Ban;
