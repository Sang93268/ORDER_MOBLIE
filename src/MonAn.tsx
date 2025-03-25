import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, TextInput } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import 'react-native-gesture-handler';

// Định nghĩa kiểu navigation
type RootStackParamList = {
    Ban: undefined;
    MonAn: { tableId: number; tableName: string };
};

type MonAnRouteProp = RouteProp<RootStackParamList, 'MonAn'>;
type MonAnNavigationProp = StackNavigationProp<RootStackParamList, 'MonAn'>;

// Định nghĩa cấu trúc dữ liệu món ăn
type FoodItem = {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
};

// Định nghĩa cấu trúc dữ liệu món ăn đã chọn
type OrderItem = {
    food: FoodItem;
    quantity: number;
};

const MonAn = () => {
    const route = useRoute<MonAnRouteProp>();
    const navigation = useNavigation<MonAnNavigationProp>();

    // Lấy thông tin bàn được truyền qua navigation
    const { tableId, tableName } = route.params;

    // Danh sách món ăn mẫu
    const [foodList] = useState<FoodItem[]>([
        { id: 1, name: 'Phở bò', price: 45000, category: 'Món chính', image: 'https://hidafoods.vn/wp-content/uploads/2024/01/nau-pho-bo-nam-dinh-1.jpg', description: 'Phở bò thơm ngon đặc trưng' },
        { id: 2, name: 'Cơm tấm', price: 35000, category: 'Món chính', image: 'https://static.vinwonders.com/production/com-tam-sai-gon-2.jpg', description: 'Cơm tấm sườn bì chả' },
        { id: 3, name: 'Gỏi cuốn', price: 25000, category: 'Khai vị', image: 'https://khaihoanphuquoc.com.vn/wp-content/uploads/2023/11/nu%CC%9Bo%CC%9B%CC%81c-ma%CC%86%CC%81m-cha%CC%82%CC%81m-go%CC%89i-cuo%CC%82%CC%81n-1200x900.png', description: 'Gỏi cuốn tôm thịt' },
        { id: 4, name: 'Cà phê sữa đá', price: 18000, category: 'Đồ uống', image: 'https://product.hstatic.net/200000914837/product/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3.png', description: 'Cà phê sữa đá truyền thống' },
        { id: 5, name: 'Trà đào', price: 20000, category: 'Đồ uống', image: 'https://namart.com.vn/wp-content/uploads/2022/03/fdhbsx1x6tmyswssvb1v.jpg', description: 'Trà đào cam sả' },
    ]);

    // Danh sách món ăn đã chọn
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

    // Các danh mục món ăn
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

    // Thêm state cho tìm kiếm
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredFoodList, setFilteredFoodList] = useState<FoodItem[]>(foodList);

    // Cập nhật danh sách món ăn được lọc khi tìm kiếm hoặc chọn danh mục
    useEffect(() => {
        let result = foodList;

        // Lọc theo danh mục nếu không phải "Tất cả"
        if (selectedCategory !== 'Tất cả') {
            result = result.filter(food => food.category === selectedCategory);
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchQuery.trim() !== '') {
            const lowercaseQuery = searchQuery.toLowerCase().trim();
            result = result.filter(food =>
                food.name.toLowerCase().includes(lowercaseQuery) ||
                food.description.toLowerCase().includes(lowercaseQuery)
            );
        }

        setFilteredFoodList(result);
    }, [searchQuery, selectedCategory, foodList]);

    // Thêm món ăn vào danh sách đã chọn
    const addToOrder = (food: FoodItem) => {
        setSelectedItems(prevItems => {
            const existingItem = prevItems.find(item => item.food.id === food.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.food.id === food.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { food, quantity: 1 }];
            }
        });
    };

    // Giảm số lượng món ăn
    const decreaseQuantity = (foodId: number) => {
        setSelectedItems(prevItems => {
            const existingItem = prevItems.find(item => item.food.id === foodId);
            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map(item =>
                    item.food.id === foodId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevItems.filter(item => item.food.id !== foodId);
            }
        });
    };

    // Tổng tiền
    const totalPrice = selectedItems.reduce(
        (total, item) => total + item.food.price * item.quantity,
        0
    );

    return (
        <View style={styles.container}>
            <View style={styles.compactHeader}>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>Thực đơn</Text>
                    <Text style={styles.tableInfo}>Bàn: {tableName}</Text>
                </View>
            </View>

            {/* Thanh tìm kiếm */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm món ăn..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                    {searchQuery ? (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setSearchQuery('')}
                        >
                            <Text style={styles.clearButtonText}>✕</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <FlatList
                data={filteredFoodList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.foodItem}>
                        <Image source={{ uri: item.image }} style={styles.foodImage} />
                        <View style={styles.foodInfo}>
                            <Text style={styles.foodName}>{item.name}</Text>
                            <Text style={styles.foodPrice}>{item.price.toLocaleString()} VNĐ</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => addToOrder(item)}
                        >
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
                style={styles.foodList}
                ListEmptyComponent={
                    <View style={styles.emptyResult}>
                        <Text style={styles.emptyResultText}>
                            Không tìm thấy món ăn phù hợp
                        </Text>
                    </View>
                }
            />

            {selectedItems.length > 0 && (
                <View style={styles.orderSummary}>
                    <View style={styles.orderHeader}>
                        <Text style={styles.orderTitle}>Món đã chọn</Text>
                        <Text style={styles.totalPrice}>{totalPrice.toLocaleString()} VNĐ</Text>
                    </View>
                    <ScrollView style={styles.orderList} nestedScrollEnabled={true}>
                        {selectedItems.map(item => (
                            <View key={item.food.id} style={styles.orderItem}>
                                <Text style={styles.orderItemName} numberOfLines={1}>{item.food.name}</Text>
                                <View style={styles.quantityControl}>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => decreaseQuantity(item.food.id)}
                                    >
                                        <Text style={styles.quantityButtonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantity}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => addToOrder(item.food)}
                                    >
                                        <Text style={styles.quantityButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.orderItemPrice}>
                                    {(item.food.price * item.quantity).toLocaleString()}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Xác nhận đặt món</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    compactHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#2196F3',
    },
    headerInfo: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    tableInfo: {
        fontSize: 14,
        color: '#fff',
    },
    backButtonSmall: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 18,
        paddingHorizontal: 12,
        height: 36,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        height: 36,
        padding: 0,
    },
    clearButton: {
        padding: 4,
    },
    clearButtonText: {
        color: '#999',
        fontSize: 14,
        fontWeight: 'bold',
    },
    categoryScroll: {
        marginTop: 8,
        paddingBottom: 4,
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
    },
    selectedCategory: {
        backgroundColor: '#2196F3',
    },
    categoryText: {
        color: '#333',
        fontSize: 12,
    },
    selectedCategoryText: {
        color: '#fff',
        fontSize: 12,
    },
    emptyResult: {
        padding: 20,
        alignItems: 'center',
    },
    emptyResultText: {
        color: '#888',
        fontSize: 14,
    },
    foodList: {
        flex: 1,
        marginTop: 4,
    },
    foodItem: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#fff',
        marginBottom: 4,
        marginHorizontal: 8,
        borderRadius: 8,
        elevation: 1,
    },
    foodImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
    },
    foodInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    foodName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    foodDescription: {
        display: 'none', // Ẩn mô tả để tiết kiệm không gian
    },
    foodPrice: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#E91E63',
        marginTop: 2,
    },
    addButton: {
        backgroundColor: '#2196F3',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderSummary: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 12,
        elevation: 8,
        maxHeight: '40%', // Giới hạn chiều cao tối đa
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderList: {
        maxHeight: 150, // Giới hạn chiều cao danh sách món đặt
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderItemName: {
        flex: 1,
        fontSize: 14,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    quantityButton: {
        backgroundColor: '#f0f0f0',
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    quantity: {
        marginHorizontal: 6,
        fontSize: 14,
    },
    orderItemPrice: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#E91E63',
        width: 70,
        textAlign: 'right',
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E91E63',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    backButton: {
        display: 'none', // Đã thay thế bằng nút nhỏ ở header
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default MonAn;