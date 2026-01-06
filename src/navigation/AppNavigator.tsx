import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import NewOrderScreen from '../screens/NewOrderScreen';
import DishesScreen from '../screens/DishesScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import CustomerOrdersScreen from '../screens/CustomerOrdersScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Componente para iconos de tabs
const TabIcon: React.FC<{icon: string; color?: string}> = ({icon}) => {
  return <Text style={{fontSize: 18}}>{icon}</Text>;
};

// Stack Navigator para Orders (permite navegar a CustomerOrdersScreen)
const OrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OrdersList" component={OrdersScreen} />
      <Stack.Screen name="CustomerOrders" component={CustomerOrdersScreen} />
      <Stack.Screen name="NewCustomerOrder" component={NewOrderScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#A67C52', // Café medio claro
          tabBarInactiveTintColor: '#C4A57B', // Café con leche
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E8D5C4',
            paddingBottom: 10,
            paddingTop: 10,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
          },
          headerShown: false,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Inicio',
            tabBarIcon: ({color}) => <TabIcon icon="🏠" color={color} />,
          }}
        />
        <Tab.Screen
          name="Orders"
          component={OrdersStack}
          options={{
            tabBarLabel: 'Pedidos',
            tabBarIcon: ({color}) => <TabIcon icon="📋" color={color} />,
          }}
        />
        <Tab.Screen
          name="NewOrder"
          component={NewOrderScreen}
          options={{
            tabBarLabel: 'Nuevo',
            tabBarIcon: ({color}) => <TabIcon icon="➕" color={color} />,
          }}
        />
        <Tab.Screen
          name="Dishes"
          component={DishesScreen}
          options={{
            tabBarLabel: 'Platos',
            tabBarIcon: ({color}) => <TabIcon icon="🍽️" color={color} />,
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            tabBarLabel: 'Stats',
            tabBarIcon: ({color}) => <TabIcon icon="📊" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
