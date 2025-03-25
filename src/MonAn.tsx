import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, TextInput } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import 'react-native-gesture-handler';


type RootStackParamList = {
    Ban: undefined;
    MonAn: { tableId: number; tableName: string };
};

type MonAnRouteProp = RouteProp<RootStackParamList, 'MonAn'>;
type MonAnNavigationProp = StackNavigationProp<RootStackParamList, 'MonAn'>;


type FoodItem = {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
};


type OrderItem = {
    food: FoodItem;
    quantity: number;
    note?: string;
};

const MonAn = () => {
    const route = useRoute<MonAnRouteProp>();
    const navigation = useNavigation<MonAnNavigationProp>();

    const { tableId, tableName } = route.params;

    const [foodList] = useState<FoodItem[]>([
        { id: 1, name: 'Phở bò', price: 45000, category: 'Món chính', image: 'https://hidafoods.vn/wp-content/uploads/2024/01/nau-pho-bo-nam-dinh-1.jpg', description: 'Phở bò thơm ngon đặc trưng' },
        { id: 2, name: 'Cơm tấm', price: 35000, category: 'Món chính', image: 'https://static.vinwonders.com/production/com-tam-sai-gon-2.jpg', description: 'Cơm tấm sườn bì chả' },
        { id: 3, name: 'Gỏi cuốn', price: 25000, category: 'Khai vị', image: 'https://khaihoanphuquoc.com.vn/wp-content/uploads/2023/11/nu%CC%9Bo%CC%9B%CC%81c-ma%CC%86%CC%81m-cha%CC%82%CC%81m-go%CC%89i-cuo%CC%82%CC%81n-1200x900.png', description: 'Gỏi cuốn tôm thịt' },
        { id: 4, name: 'Cà phê sữa đá', price: 18000, category: 'Đồ uống', image: 'https://product.hstatic.net/200000914837/product/cafe_sua_da_ee2490f7d7dc47748ae88e323b31fa2b_eab075b7a57149fe80a152ade1b9cbc3.png', description: 'Cà phê sữa đá truyền thống' },
        { id: 5, name: 'Trà đào', price: 20000, category: 'Đồ uống', image: 'https://namart.com.vn/wp-content/uploads/2022/03/fdhbsx1x6tmyswssvb1v.jpg', description: 'Trà đào cam sả' },
    ]);

    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredFoodList, setFilteredFoodList] = useState<FoodItem[]>(foodList);
    const [noteModalVisible, setNoteModalVisible] = useState<boolean>(false);
    const [currentFoodItem, setCurrentFoodItem] = useState<FoodItem | null>(null);
    const [noteText, setNoteText] = useState<string>('');
    const [modalQuantity, setModalQuantity] = useState<number>(1);

    const [orderExpanded, setOrderExpanded] = useState<boolean>(false);

    useEffect(() => {
        let result = foodList;

        if (selectedCategory !== 'Tất cả') {
            result = result.filter(food => food.category === selectedCategory);
        }


        if (searchQuery.trim() !== '') {
            const lowercaseQuery = searchQuery.toLowerCase().trim();
            result = result.filter(food =>
                food.name.toLowerCase().includes(lowercaseQuery) ||
                food.description.toLowerCase().includes(lowercaseQuery)
            );
        }

        setFilteredFoodList(result);
    }, [searchQuery, selectedCategory, foodList]);


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


    const totalPrice = selectedItems.reduce(
        (total, item) => total + item.food.price * item.quantity,
        0
    );


    const handleFoodItemPress = (food: FoodItem) => {
        setCurrentFoodItem(food);


        const existingItem = selectedItems.find(item => item.food.id === food.id);
        if (existingItem) {

            setModalQuantity(existingItem.quantity);
            setNoteText(existingItem.note || '');
        } else {

            setModalQuantity(1);
            setNoteText('');
        }

        setNoteModalVisible(true);
    };


    const increaseModalQuantity = () => {
        setModalQuantity(prev => prev + 1);
    };


    const decreaseModalQuantity = () => {
        if (modalQuantity > 1) {
            setModalQuantity(prev => prev - 1);
        }
    };


    const confirmAddWithNote = () => {
        if (currentFoodItem) {
            setSelectedItems(prevItems => {
                const existingItemIndex = prevItems.findIndex(item => item.food.id === currentFoodItem.id);

                if (existingItemIndex >= 0) {

                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        quantity: modalQuantity,
                        note: noteText
                    };
                    return updatedItems;
                } else {

                    return [...prevItems, {
                        food: currentFoodItem,
                        quantity: modalQuantity,
                        note: noteText
                    }];
                }
            });
        }

        setNoteModalVisible(false);
    };


    const toggleOrderExpanded = () => {
        setOrderExpanded(!orderExpanded);
    };

    return (
        <View style={styles.container}>
            <View style={styles.compactHeader}>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>Thực đơn</Text>
                    <Text style={styles.tableInfo}>Bàn: {tableName}</Text>
                </View>
            </View>

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
                    <TouchableOpacity
                        style={styles.foodItem}
                        onPress={() => handleFoodItemPress(item)}
                    >
                        <Image source={{ uri: item.image }} style={styles.foodImage} />
                        <View style={styles.foodInfo}>
                            <Text style={styles.foodName}>{item.name}</Text>
                            <Text style={styles.foodPrice}>{item.price.toLocaleString()} VNĐ</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleFoodItemPress(item)}
                        >
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
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

            {/* Modal nhập ghi chú và điều chỉnh số lượng */}
            {noteModalVisible && currentFoodItem && (
                <View style={styles.modalOverlay}>
                    <ScrollView contentContainerStyle={styles.modalScrollContainer}>
                        <View style={styles.noteModal}>
                            {/* Hiển thị thông tin món ăn */}
                            <View style={styles.modalFoodInfo}>
                                <Image
                                    source={{ uri: currentFoodItem.image }}
                                    style={styles.modalFoodImage}
                                />
                                <View style={styles.modalFoodDetails}>
                                    <Text style={styles.noteModalTitle}>
                                        {currentFoodItem.name}
                                    </Text>
                                    <Text style={styles.modalFoodPrice}>
                                        {currentFoodItem.price.toLocaleString()} VNĐ
                                    </Text>
                                    <Text style={styles.modalFoodDescription}>
                                        {currentFoodItem.description}
                                    </Text>
                                </View>
                            </View>

                            {/* Điều chỉnh số lượng */}
                            <View style={styles.modalQuantityContainer}>
                                <Text style={styles.modalQuantityLabel}>Số lượng:</Text>
                                <View style={styles.modalQuantityControl}>
                                    <TouchableOpacity
                                        style={styles.modalQuantityButton}
                                        onPress={decreaseModalQuantity}
                                    >
                                        <Text style={styles.modalQuantityButtonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.modalQuantity}>{modalQuantity}</Text>
                                    <TouchableOpacity
                                        style={styles.modalQuantityButton}
                                        onPress={increaseModalQuantity}
                                    >
                                        <Text style={styles.modalQuantityButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Ghi chú */}
                            <Text style={styles.noteModalSubtitle}>
                                Ghi chú (tùy chọn)
                            </Text>
                            <TextInput
                                style={styles.noteInput}
                                placeholder="Nhập yêu cầu đặc biệt..."
                                value={noteText}
                                onChangeText={setNoteText}
                                multiline={true}
                                numberOfLines={3}
                            />

                            {/* Hiển thị tổng tiền */}
                            <Text style={styles.modalTotalPrice}>
                                Tổng: {(currentFoodItem.price * modalQuantity).toLocaleString()} VNĐ
                            </Text>

                            <View style={styles.noteModalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setNoteModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmNoteButton}
                                    onPress={confirmAddWithNote}
                                >
                                    <Text style={styles.confirmNoteButtonText}>
                                        {selectedItems.find(item => item.food.id === currentFoodItem.id)
                                            ? 'Cập nhật'
                                            : 'Thêm món'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Phần hiển thị món đã chọn */}
            {selectedItems.length > 0 && (
                <View style={[
                    styles.orderSummary,
                    orderExpanded && styles.orderSummaryExpanded
                ]}>
                    {/* Thanh kéo / swipe indicator */}
                    <TouchableOpacity
                        onPress={toggleOrderExpanded}
                        style={styles.swipeIndicatorContainer}
                    >
                        <View style={styles.swipeIndicator}></View>
                    </TouchableOpacity>

                    <View style={styles.orderHeader}>
                        <Text style={styles.orderTitle}>
                            Món đã chọn {orderExpanded ? '(Thu gọn)' : ''}
                        </Text>
                        <Text style={styles.totalPrice}>{totalPrice.toLocaleString()} VNĐ</Text>
                    </View>

                    {/* Hiển thị danh sách món */}
                    <ScrollView
                        style={[
                            styles.orderList,
                            orderExpanded && styles.orderListExpanded
                        ]}
                        nestedScrollEnabled={true}
                    >
                        {selectedItems.map((item, index) => (
                            <View
                                key={item.food.id}
                                style={styles.orderItem}
                            >
                                <View style={styles.orderItemDetails}>
                                    <Text style={styles.orderItemName} numberOfLines={1}>
                                        {item.food.name}
                                    </Text>
                                    {item.note ? (
                                        <Text style={styles.orderItemNote} numberOfLines={1}>
                                            Ghi chú: {item.note}
                                        </Text>
                                    ) : null}
                                </View>
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
        display: 'none',
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
        paddingTop: 6,
        elevation: 8,
        maxHeight: '35%',
    },
    orderSummaryExpanded: {
        maxHeight: '100%',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 4,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderList: {
        maxHeight: 96,
    },
    orderListExpanded: {
        maxHeight: '70%',
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderItemDetails: {
        flex: 1,
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
        display: 'none',
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        elevation: 10,
    },
    modalScrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 350,
        padding: 15,
    },
    noteModal: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        elevation: 5,
        maxHeight: undefined,
        maxWidth: 500,
    },
    modalFoodInfo: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 15,
    },
    modalFoodImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    modalFoodDetails: {
        flex: 1,
        marginLeft: 12,
    },
    modalFoodPrice: {
        fontSize: 14,
        color: '#E91E63',
        fontWeight: 'bold',
        marginTop: 4,
    },
    modalFoodDescription: {
        fontSize: 13,
        color: '#666',
        marginTop: 6,
    },
    modalQuantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    modalQuantityLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalQuantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
    },
    modalQuantityButton: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    modalQuantityButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalQuantity: {
        width: 35,
        textAlign: 'center',
        fontSize: 16,
    },
    modalTotalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E91E63',
        alignSelf: 'flex-end',
        marginBottom: 15,
        marginTop: 5,
    },
    noteModalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noteModalSubtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    noteInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 15,
    },
    noteModalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#666',
    },
    confirmNoteButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    confirmNoteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    orderItemNote: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    swipeIndicatorContainer: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    swipeIndicator: {
        width: 50,
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
    },
});

export default MonAn;