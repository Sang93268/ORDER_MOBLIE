import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import Ban from "./src/Ban";
import MonAn from "./src/MonAn";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            {/* Cấu hình màu cho thanh trạng thái */}
            <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
            
            <Stack.Navigator initialRouteName="Ban">
                <Stack.Screen
                    name="Ban"
                    component={Ban} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="MonAn" 
                    component={MonAn} 
                    options={{ title: 'Món Ăn' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
