import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {formatPrice} from '../utils/sampleData';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type RootStackParamList = {
  CustomerOrders: {customerName: string; customerLocal: string};
};

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerOrders'>;

const CustomerOrdersScreen: React.FC<Props> = ({route, navigation}) => {
  const {customerName, customerLocal} = route.params;
  const {getOrdersByCustomer, completeOrder, cancelOrder, updateOrderPaymentStatus, updateOrder, dishes} = useApp();
  
  const [showEditOrder, setShowEditOrder] = React.useState(false);
  const [editingOrder, setEditingOrder] = React.useState<any>(null);
  const [editOrderItems, setEditOrderItems] = React.useState<any[]>([]);
  const [editObservations, setEditObservations] = React.useState<string>('');
  const [editSelectedCategory, setEditSelectedCategory] = React.useState<string | null>(null);
  const categories = ['Desayuno', 'Almuerzo', 'Bebestibles', 'Otros'];
  
  const customerOrders = getOrdersByCustomer(customerName);

  const addEditItemToOrder = (dish: any) => {
    const existingItem = editOrderItems.find(item => item.dish.id === dish.id);
    if (existingItem) {
      setEditOrderItems(
        editOrderItems.map(item =>
          item.dish.id === dish.id
            ? {...item, quantity: item.quantity + 1}
            : item
        )
      );
    } else {
      setEditOrderItems([...editOrderItems, {dish, quantity: 1}]);
    }
  };

  const removeEditItemFromOrder = (dishId: string) => {
    const existingItem = editOrderItems.find(item => item.dish.id === dishId);
    if (existingItem && existingItem.quantity > 1) {
      setEditOrderItems(
        editOrderItems.map(item =>
          item.dish.id === dishId
            ? {...item, quantity: item.quantity - 1}
            : item
        )
      );
    } else {
      setEditOrderItems(editOrderItems.filter(item => item.dish.id !== dishId));
    }
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{customerName}</Text>
            <Text style={styles.subtitle}>{customerLocal}</Text>
          </View>
          <TouchableOpacity
            style={styles.addOrderButton}
            onPress={() => {
              (navigation as any).navigate('NewCustomerOrder', {
                customerName,
                customerLocal,
              });
            }}>
            <Text style={styles.addOrderButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {customerOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Sin pedidos activos</Text>
              <Text style={styles.emptySubtext}>
                Los pedidos completados o cancelados no se muestran aquí
              </Text>
            </View>
          ) : (
            <View>
              {customerOrders.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.orderTime}>
                      {new Date(order.createdAt).toLocaleTimeString('es-CL', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>

                  <View style={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                        <Text style={styles.itemName}>{item.dish.name}</Text>
                        <Text style={styles.itemPrice}>
                          ${formatPrice(item.dish.price * item.quantity)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {order.observations && (
                    <Text style={styles.observationsText}>
                      📝 Obs: {order.observations}
                    </Text>
                  )}

                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>
                      Total: ${formatPrice(order.total)}
                    </Text>
                  </View>

                  <View style={styles.paymentStatus}>
                    <TouchableOpacity
                      style={[
                        styles.paymentButton,
                        order.paid ? styles.paidButton : styles.unpaidButton,
                      ]}
                      onPress={async () => {
                        await updateOrderPaymentStatus(order.id, !order.paid);
                      }}>
                      <Text style={styles.paymentButtonText}>
                        {order.paid ? '✓ Pagado' : '✗ Debe'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.orderActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => {
                        setEditingOrder(order);
                        setEditObservations(order.observations || '');
                        setEditOrderItems([...order.items]);
                        setEditSelectedCategory(null);
                        setShowEditOrder(true);
                      }}>
                      <Text style={styles.completeButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => {
                        Alert.alert(
                          'Cancelar Pedido',
                          '¿Estás seguro de cancelar este pedido?',
                          [
                            {text: 'No', style: 'cancel'},
                            {
                              text: 'Sí, Cancelar',
                              style: 'destructive',
                              onPress: async () => {
                                await cancelOrder(order.id);
                                Alert.alert('Pedido cancelado');
                              },
                            },
                          ]
                        );
                      }}>
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => {
                        Alert.alert(
                          'Completar Pedido',
                          '¿Marcar como completado?',
                          [
                            {text: 'No', style: 'cancel'},
                            {
                              text: 'Sí, Completar',
                              onPress: async () => {
                                await completeOrder(order.id);
                                Alert.alert('Pedido completado');
                              },
                            },
                          ]
                        );
                      }}>
                      <Text style={styles.completeButtonText}>Completar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Modal de Edición de Pedido con Selector de Platos */}
      <Modal
        visible={showEditOrder}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditOrder(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Pedido</Text>
            <TouchableOpacity onPress={() => setShowEditOrder(false)}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {editingOrder && (
              <View style={styles.editFormContainer}>
                {/* Selector de Platos */}
                <Text style={styles.editSectionTitle}>Agregar o Modificar Platos</Text>
                
                {/* Botones de Categorías */}
                <View style={{flexDirection: 'row', gap: 10}}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButtonEdit,
                        editSelectedCategory === category && styles.categoryButtonEditActive,
                      ]}
                      onPress={() => setEditSelectedCategory(category)}>
                      <Text
                        style={[
                          styles.categoryButtonTextEdit,
                          editSelectedCategory === category && styles.categoryButtonTextEditActive,
                        ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Lista de Platos */}
                {editSelectedCategory && dishes.filter(d => d.category === editSelectedCategory).length > 0 && (
                  <View style={styles.dishGridEdit}>
                    {dishes.filter(d => d.category === editSelectedCategory).map(dish => (
                      <TouchableOpacity
                        key={dish.id}
                        style={styles.dishCardEdit}
                        onPress={() => addEditItemToOrder(dish)}>
                        <Text style={styles.dishNameEdit}>{dish.name}</Text>
                        <Text style={styles.dishPriceEdit}>${formatPrice(dish.price)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.divider} />

                {/* Ítems Actuales */}
                <Text style={styles.editSectionTitle}>Ítems del Pedido</Text>
                {editOrderItems.length > 0 ? (
                  editOrderItems.map((item: any, idx: number) => (
                    <View key={`${item.dish.id}-${idx}`} style={styles.editItemCard}>
                      <View style={styles.editItemContent}>
                        <View style={{flex: 1}}>
                          <Text style={styles.editItemName}>{item.quantity}x {item.dish.name}</Text>
                          <Text style={styles.editItemPrice}>${formatPrice(item.dish.price * item.quantity)}</Text>
                        </View>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            style={styles.qtyButton}
                            onPress={() => removeEditItemFromOrder(item.dish.id)}>
                            <Text style={styles.qtyButtonText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{item.quantity}</Text>
                          <TouchableOpacity
                            style={styles.qtyButton}
                            onPress={() => addEditItemToOrder(item.dish)}>
                            <Text style={styles.qtyButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>Sin ítems en el pedido</Text>
                )}

                <View style={styles.divider} />

                {/* Observaciones */}
                <Text style={styles.editSectionTitle}>Observaciones</Text>
                <TextInput
                  style={styles.editObservationsInput}
                  placeholder="Agrega observaciones..."
                  placeholderTextColor="#999"
                  value={editObservations}
                  onChangeText={setEditObservations}
                  multiline={true}
                  numberOfLines={3}
                />

                {/* Total */}
                {editOrderItems.length > 0 && (
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>
                      Total: ${formatPrice(editOrderItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0))}
                    </Text>
                  </View>
                )}

                <View style={styles.editButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.editModalButton, styles.cancelEditButton]}
                    onPress={() => setShowEditOrder(false)}>
                    <Text style={styles.editModalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.editModalButton, styles.saveEditButton]}
                    onPress={async () => {
                      if (editingOrder) {
                        if (editOrderItems.length === 0) {
                          Alert.alert('Error', 'El pedido debe tener al menos un plato');
                          return;
                        }
                        const updatedOrder = {
                          ...editingOrder,
                          items: editOrderItems,
                          total: editOrderItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0),
                          observations: editObservations.trim() || undefined
                        };
                        await updateOrder(updatedOrder);
                        setShowEditOrder(false);
                        Alert.alert('Éxito', 'Pedido actualizado');
                      }
                    }}>
                    <Text style={styles.editModalButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    backgroundColor: '#DAA520',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#C4A57B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  addOrderButton: {
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  addOrderButtonText: {
    color: '#DAA520',
    fontSize: 26,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    padding: 36,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#DAA520',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
  },
  orderDate: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  orderTime: {
    fontSize: 15,
    color: '#666',
  },
  orderItems: {
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemQuantity: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#DAA520',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 12,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  observationsText: {
    marginTop: 6,
    fontSize: 14,
    color: '#8B572A',
  },
    width: 40,
  },
  orderFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    fontSize: 14,
    marginBottom: 10,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  paymentStatus: {
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  paymentButton: {
    flex: 0.8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidButton: {
    backgroundColor: '#4CAF50',
  },
  unpaidButton: {
    backgroundColor: '#C4A57B',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderActions: {
    gap: 12,
    flexDirection: 'row',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#8B4789',
  },
  cancelButton: {
    backgroundColor: '#C4A57B',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#DAA520',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  modalHeader: {
    backgroundColor: '#DAA520',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeIconText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  editFormContainer: {
    paddingBottom: 20,
  },
  editSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A67C52',
    marginBottom: 12,
    marginTop: 12,
  },
  categoryButtonEdit: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  categoryButtonEditActive: {
    backgroundColor: '#DAA520',
    borderColor: '#DAA520',
  },
  categoryButtonTextEdit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A67C52',
  },
  categoryButtonTextEditActive: {
    color: '#fff',
  },
  dishGridEdit: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 12,
  },
  dishCardEdit: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  dishNameEdit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  dishPriceEdit: {
    fontSize: 12,
    color: '#C4A57B',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  editItemCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#DAA520',
  },
  editItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  editItemPrice: {
    fontSize: 13,
    color: '#C4A57B',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#DAA520',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  editObservationsInput: {
    borderWidth: 1,
    borderColor: '#E8D5C4',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  editModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelEditButton: {
    backgroundColor: '#C4A57B',
  },
  saveEditButton: {
    backgroundColor: '#E6A45D',
  },
  editModalButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CustomerOrdersScreen;
