import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {Dish, OrderItem, TableStatus} from '../types';
import {formatPrice, getChileDate} from '../utils/sampleData';

interface NewOrderScreenProps {
  navigation: any;
  route?: {
    params?: {
      customerName?: string;
      customerLocal?: string;
    };
  };
}

const NewOrderScreen: React.FC<NewOrderScreenProps> = ({navigation, route}) => {
  const {dishes, tables, addOrder} = useApp();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [observations, setObservations] = useState<string>('');
  
  const customerName = route?.params?.customerName;
  const customerLocal = route?.params?.customerLocal;

  const categories = ['Desayuno', 'Almuerzo', 'Bebestibles', 'Otros'];
  
  const filteredDishes = selectedCategory ? dishes.filter(dish => dish.category === selectedCategory) : [];

  const availableTables = tables.filter(
    t => t.status === TableStatus.AVAILABLE
  );

  const addItemToOrder = (dish: Dish) => {
    const existingItem = orderItems.find(item => item.dish.id === dish.id);
    
    if (existingItem) {
      setOrderItems(
        orderItems.map(item =>
          item.dish.id === dish.id
            ? {...item, quantity: item.quantity + 1}
            : item
        )
      );
    } else {
      setOrderItems([...orderItems, {dish, quantity: 1}]);
    }
  };

  const removeItemFromOrder = (dishId: string) => {
    const existingItem = orderItems.find(item => item.dish.id === dishId);
    
    if (existingItem && existingItem.quantity > 1) {
      setOrderItems(
        orderItems.map(item =>
          item.dish.id === dishId
            ? {...item, quantity: item.quantity - 1}
            : item
        )
      );
    } else {
      setOrderItems(orderItems.filter(item => item.dish.id !== dishId));
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.dish.price * item.quantity,
      0
    );
  };

  const handleCreateOrder = async () => {
    if (orderItems.length === 0) {
      Alert.alert('Error', 'Agrega al menos un plato al pedido');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      tableId: selectedTable,
      customerName: customerName,
      items: orderItems,
      total: calculateTotal(),
      createdAt: getChileDate(),
      completed: false,
      observations: observations.trim() || undefined,
    };

    await addOrder(newOrder);
    
    const orderLocation = customerName 
      ? `para ${customerName}`
      : selectedTable 
        ? `para Mesa ${selectedTable}` 
        : 'en Zona Libre';
    
    Alert.alert(
      'Pedido Creado',
      `Pedido creado exitosamente ${orderLocation}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setOrderItems([]);
            setSelectedTable(null);
            setObservations('');
            if (customerName) {
              navigation.goBack();
            } else {
              navigation.navigate('Orders');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {customerName ? (
          <View>
            <Text style={styles.title}>Nuevo Pedido para Cliente</Text>
            <Text style={styles.customerInfo}>{customerName} - {customerLocal}</Text>
          </View>
        ) : (
          <Text style={styles.title}>Nuevo Pedido</Text>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Selector de Mesa - Solo mostrar si NO es pedido de cliente */}
        {!customerName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seleccionar Mesa</Text>
          <View style={styles.tableSelector}>
            <TouchableOpacity
              style={[
                styles.tableOption,
                selectedTable === null && styles.tableOptionSelected,
              ]}
              onPress={() => setSelectedTable(null)}>
              <Text
                style={[
                  styles.tableOptionText,
                  selectedTable === null && styles.tableOptionTextSelected,
                ]}>
                Zona Libre
              </Text>
            </TouchableOpacity>

            {availableTables.map(table => (
              <TouchableOpacity
                key={table.id}
                style={[
                  styles.tableOption,
                  selectedTable === table.id && styles.tableOptionSelected,
                ]}
                onPress={() => setSelectedTable(table.id)}>
                <Text
                  style={[
                    styles.tableOptionText,
                    selectedTable === table.id && styles.tableOptionTextSelected,
                  ]}>
                  Mesa {table.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        )}

        {/* Lista de Platos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platos Disponibles</Text>
          
          {/* Botones de Categorías */}
          <View style={styles.categoryButtons}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}>
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!selectedCategory ? (
            <Text style={styles.emptyText}>
              Selecciona una categoría para ver los platos disponibles.
            </Text>
          ) : filteredDishes.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay platos en esta categoría.
            </Text>
          ) : (
            <View style={styles.dishGrid}>
              {filteredDishes.map(dish => (
                <TouchableOpacity
                  key={dish.id}
                  style={styles.dishCard}
                  onPress={() => addItemToOrder(dish)}>
                  <View style={styles.dishInfo}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishCategory}>{dish.category}</Text>
                    <Text style={styles.dishDescription}>{dish.description}</Text>
                  </View>
                  <Text style={styles.dishPrice}>${formatPrice(dish.price)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Pedido Actual */}
        {orderItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pedido Actual</Text>
            <View style={styles.orderGrid}>
              {orderItems.map(item => (
                <View key={item.dish.id} style={styles.orderItemCard}>
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemName}>{item.dish.name}</Text>
                    <Text style={styles.orderItemSubtotal}>
                      ${formatPrice(item.dish.price * item.quantity)}
                    </Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => removeItemFromOrder(item.dish.id)}>
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => addItemToOrder(item.dish)}>
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${formatPrice(calculateTotal())}</Text>
            </View>

            {/* Observaciones */}
            <View style={styles.observationsSection}>
              <Text style={styles.observationsLabel}>Observaciones (Opcional)</Text>
              <TextInput
                style={styles.observationsInput}
                placeholder="Ej: Sin cebolla, extra queso, alergias..."
                placeholderTextColor="#999"
                value={observations}
                onChangeText={setObservations}
                multiline={true}
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateOrder}>
              <Text style={styles.createButtonText}>Crear Pedido</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0', // Crema muy claro
  },
  header: {
    backgroundColor: '#fff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A67C52', // Café medio claro
  },
  customerInfo: {
    fontSize: 15,
    color: '#C4A57B',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  categoryButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#DAA520',
    borderColor: '#DAA520',
  },
  categoryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#A67C52',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  tableSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tableOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tableOptionSelected: {
    borderColor: '#DAA520', // Dorado brillante
    backgroundColor: '#DAA520',
  },
  tableOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  tableOptionTextSelected: {
    color: '#fff',
  },
  dishGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
  },
  dishCard: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dishCategory: {
    fontSize: 12,
    color: '#A67C52',
    marginBottom: 3,
  },
  dishDescription: {
    fontSize: 12,
    color: '#666',
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E6A45D', // Dorado cálido
    marginLeft: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
  orderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
  },
  orderItemCard: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    marginBottom: 10,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  orderItemSubtotal: {
    fontSize: 13,
    color: '#E6A45D', // Dorado cálido
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    backgroundColor: '#DAA520', // Dorado brillante
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 18,
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CD853F', // Dorado oscuro
  },
  observationsSection: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  observationsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A67C52',
    marginBottom: 8,
  },
  observationsInput: {
    borderWidth: 1,
    borderColor: '#E8D5C4',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#E6A45D', // Dorado cálido
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewOrderScreen;
