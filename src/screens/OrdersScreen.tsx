import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {TableStatus} from '../types';
import {formatPrice} from '../utils/sampleData';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type RootStackParamList = {
  OrdersList: undefined;
  CustomerOrders: {customerName: string; customerLocal: string};
};

type Props = NativeStackScreenProps<RootStackParamList, 'OrdersList'>;

const OrdersScreen: React.FC<Props> = ({navigation}) => {
  const {tables, orders, getOrdersByTable, completeOrder, cancelOrder, frequentCustomers, addFrequentCustomer, deleteFrequentCustomer, getOrdersByCustomer} = useApp();
  const [showFrequentCustomers, setShowFrequentCustomers] = React.useState(false);
  const [showAddCustomer, setShowAddCustomer] = React.useState(false);
  const [customerName, setCustomerName] = React.useState('');
  const [customerLocal, setCustomerLocal] = React.useState('');

  const getTableColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return '#DAA520'; // Dorado brillante - Disponible
      case TableStatus.OCCUPIED:
        return '#D2855D'; // Terracota suave - Ocupada
      case TableStatus.RESERVED:
        return '#E6A45D'; // Dorado cálido - Reservada
      default:
        return '#C4A57B';
    }
  };

  const renderTable = (table: {id: number; status: TableStatus}) => {
    const orders = getOrdersByTable(table.id);
    const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);

    return (
      <View key={table.id} style={styles.tableCard}>
        <View
          style={[
            styles.tableHeader,
            {backgroundColor: getTableColor(table.status)},
          ]}>
          <Text style={styles.tableTitle}>Mesa {table.id}</Text>
          <Text style={styles.tableStatus}>{table.status}</Text>
        </View>

        {orders.length > 0 ? (
          <View style={styles.ordersContainer}>
            {orders.map(order => (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderTime}>
                    {new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.orderTotal}>${formatPrice(order.total)}</Text>
                </View>
                
                {order.items.map((item, idx) => (
                  <Text key={idx} style={styles.orderItemText}>
                    {item.quantity}x {item.dish.name}
                  </Text>
                ))}

                <View style={styles.actionButtons}>
                  <Pressable
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() =>
                      Alert.alert(
                        'Editar Pedido',
                        'Función de edición pendiente. Ajusta los ítems en una próxima versión.',
                        [{text: 'Entendido', style: 'default'}],
                      )
                    }>
                    <Text style={styles.completeButtonText}>Editar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => {
                      console.log('CANCEL BUTTON PRESSED FOR ORDER:', order.id);
                      Alert.alert(
                        'Cancelar Pedido',
                        '¿Estás seguro de que deseas cancelar este pedido?',
                        [
                          {text: 'No', onPress: () => {}, style: 'cancel'},
                          {
                            text: 'Sí, Cancelar',
                            style: 'destructive',
                            onPress: async () => {
                              console.log('Confirming cancel for order:', order.id);
                              await cancelOrder(order.id);
                              Alert.alert('Pedido cancelado', 'El pedido ha sido cancelado');
                            },
                          },
                        ]
                      );
                    }}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={() => {
                      console.log('COMPLETE BUTTON PRESSED FOR ORDER:', order.id);
                      Alert.alert(
                        'Completar Pedido',
                        '¿Marcar este pedido como completado?',
                        [
                          {text: 'No', onPress: () => {}, style: 'cancel'},
                          {
                            text: 'Sí, Completar',
                            onPress: async () => {
                              console.log('Confirming complete for order:', order.id);
                              await completeOrder(order.id);
                              Alert.alert('Pedido completado', 'El pedido ha sido marcado como completado');
                            },
                          },
                        ]
                      );
                    }}>
                    <Text style={styles.completeButtonText}>Completar</Text>
                  </Pressable>
                </View>
              </View>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: ${formatPrice(totalAmount)}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Sin pedidos activos</Text>
          </View>
        )}
      </View>
    );
  };

  const freeZoneOrders = getOrdersByTable(null).filter(order => !order.customerName);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Pedidos por Mesa</Text>
          <TouchableOpacity 
            style={styles.frequentCustomersButton}
            onPress={() => setShowFrequentCustomers(true)}>
            <Text style={styles.frequentCustomersButtonText}>⭐ Frecuentes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {tables.map(renderTable)}

          {/* Zona Libre */}
          <View style={styles.tableCard}>
            <View style={[styles.tableHeader, {backgroundColor: '#8B4789'}]}>
              <Text style={styles.tableTitle}>Zona Libre</Text>
              <Text style={styles.tableStatus}>Sin Mesa</Text>
            </View>

            {freeZoneOrders.length > 0 ? (
              <View style={styles.ordersContainer}>
                {freeZoneOrders.map(order => (
                  <View key={order.id} style={styles.orderItem}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderTime}>
                        {new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <Text style={styles.orderTotal}>${formatPrice(order.total)}</Text>
                    </View>
                    
                    {order.items.map((item, idx) => (
                      <Text key={idx} style={styles.orderItemText}>
                        {item.quantity}x {item.dish.name}
                      </Text>
                    ))}

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() =>
                          Alert.alert(
                            'Editar Pedido',
                            'Función de edición pendiente. Ajusta los ítems en una próxima versión.',
                            [{text: 'Entendido', style: 'default'}],
                          )
                        }>
                        <Text style={styles.completeButtonText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() =>
                          Alert.alert(
                            'Cancelar Pedido',
                            '¿Estás seguro de que deseas cancelar este pedido?',
                            [
                              {text: 'No', onPress: () => {}, style: 'cancel'},
                              {text: 'Sí, Cancelar', onPress: () => cancelOrder(order.id), style: 'destructive'},
                            ]
                          )
                        }>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() =>
                          Alert.alert(
                            'Completar Pedido',
                            '¿Marcar este pedido como completado?',
                            [
                              {text: 'No', onPress: () => {}, style: 'cancel'},
                              {text: 'Sí, Completar', onPress: () => completeOrder(order.id)},
                            ]
                          )
                        }>
                        <Text style={styles.completeButtonText}>Completar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Sin pedidos en zona libre</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>

    {/* Modal de Clientes Frecuentes - FUERA de SafeAreaView */}
    <Modal
      visible={showFrequentCustomers}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFrequentCustomers(false)}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>⭐ Clientes Frecuentes</Text>
          <TouchableOpacity onPress={() => setShowFrequentCustomers(false)}>
            <Text style={styles.closeIconText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {!showAddCustomer ? (
            <>
              {frequentCustomers.length === 0 ? (
                <View style={styles.emptyCustomers}>
                  <Text style={styles.emptyCustomersText}>Sin clientes registrados</Text>
                </View>
              ) : (
                <View>
                  {frequentCustomers.map(customer => {
                    const pendingOrders = getOrdersByCustomer(customer.name);
                    const unpaidCount = pendingOrders.filter(o => !o.paid).length;
                    const customerOrders = orders.filter(o => o.customerName === customer.name);
                    const customerTotal = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
                    return (
                    <View key={customer.id} style={styles.customerCard}>
                      <View style={styles.customerDetails}>
                        <Text style={styles.customerNameBold}>{customer.name}</Text>
                        <Text style={styles.customerLocalText}>Local: {customer.local}</Text>
                        <Text style={styles.customerTotalText}>Total acumulado: ${formatPrice(customerTotal)}</Text>
                        <Text style={styles.pendingOrdersText}>
                          📋 {pendingOrders.length} pedido{pendingOrders.length !== 1 ? 's' : ''} pendiente{pendingOrders.length !== 1 ? 's' : ''}
                          {unpaidCount > 0 && ` • ${unpaidCount} sin pagar`}
                        </Text>
                      </View>
                      <View style={styles.customerActions}>
                        <Pressable
                          style={styles.ordersButton}
                          onPress={() => {
                            navigation.navigate('CustomerOrders', {
                              customerName: customer.name,
                              customerLocal: customer.local,
                            });
                          }}>
                          <Text style={styles.ordersButtonText}>Ver pedidos</Text>
                        </Pressable>
                        <Pressable
                          style={styles.deleteCustomerButton}
                          onPress={() => {
                            Alert.alert(
                              'Eliminar Cliente',
                              `¿Eliminar a ${customer.name}?`,
                              [
                                {text: 'Cancelar', style: 'cancel'},
                                {
                                  text: 'Eliminar',
                                  style: 'destructive',
                                  onPress: async () => {
                                    await deleteFrequentCustomer(customer.id);
                                    Alert.alert('Cliente eliminado', `${customer.name} ha sido eliminado`);
                                  },
                                },
                              ]
                            );
                          }}>
                          <Text style={styles.deleteButtonText}>🗑️</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                  })}
                </View>
              )}

              <Pressable
                style={styles.addCustomerButton}
                onPress={() => {
                  setShowAddCustomer(true);
                  setCustomerName('');
                  setCustomerLocal('');
                }}>
                <Text style={styles.addCustomerButtonText}>+ Agregar Cliente</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Agregar Cliente</Text>

                <Text style={styles.label}>Nombre del Cliente *</Text>
                <TextInput
                  style={styles.formInput}
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="Ej: Juan Pérez"
                />

                <Text style={styles.label}>Local *</Text>
                <TextInput
                  style={styles.formInput}
                  value={customerLocal}
                  onChangeText={setCustomerLocal}
                  placeholder="Ej: Oficina, Casa, Restaurante, etc"
                />

                <View style={styles.formActions}>
                  <Pressable
                    style={styles.cancelFormButton}
                    onPress={() => setShowAddCustomer(false)}>
                    <Text style={styles.cancelFormButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.saveFormButton}
                    onPress={async () => {
                      if (!customerName || !customerLocal) {
                        Alert.alert('Error', 'Nombre y Local son obligatorios');
                        return;
                      }
                      const newCustomer = {
                        id: Date.now().toString(),
                        name: customerName,
                        local: customerLocal,
                        createdAt: new Date(),
                      };
                      await addFrequentCustomer(newCustomer);
                      Alert.alert('Cliente agregado', `${customerName} ha sido agregado`);
                      setShowAddCustomer(false);
                      setCustomerName('');
                      setCustomerLocal('');
                    }}>
                    <Text style={styles.saveFormButtonText}>Guardar</Text>
                  </Pressable>
                </View>
              </View>
            </>
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
    backgroundColor: '#FFF8F0', // Crema muy claro
  },
  header: {
    backgroundColor: '#fff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A67C52', // Café medio claro
  },
  frequentCustomersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DAA520',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  frequentCustomersButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  closeIconText: {
    fontSize: 18,
    color: '#A67C52',
    fontWeight: 'bold',
  },
  avatarText: {
    fontSize: 28,
  },
  content: {
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tableCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  tableStatus: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  ordersContainer: {
    padding: 12,
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E6A45D', // Dorado cálido
  },
  orderItemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#8B4789',
  },
  cancelButton: {
    backgroundColor: '#C4A57B', // Café con leche
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: '#DAA520', // Dorado brillante
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 6,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A67C52',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  frequentCustomerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DAA520',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  customerStats: {
    fontSize: 9,
    color: '#C4A57B',
  },
  infoBox: {
    backgroundColor: '#FFFAF0',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#DAA520',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 10,
    color: '#666',
    lineHeight: 15,
  },
  closeButton: {
    backgroundColor: '#DAA520',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  customerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 14,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 6,
    borderLeftColor: '#DAA520',
  },
  customerDetails: {
    flex: 1,
  },
  customerNameBold: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  customerLocalText: {
    fontSize: 14,
    color: '#666',
  },
  customerTotalText: {
    fontSize: 13,
    color: '#A67C52',
    fontWeight: '700',
    marginTop: 4,
  },
  pendingOrdersText: {
    fontSize: 12,
    color: '#C4A57B',
    fontWeight: '600',
    marginTop: 6,
  },
  customerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  ordersButton: {
    backgroundColor: '#DAA520',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  ordersButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteCustomerButton: {
    backgroundColor: '#E8D5C4',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  addCustomerButton: {
    backgroundColor: '#DAA520',
    margin: 14,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  addCustomerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 14,
    padding: 18,
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 6,
    marginTop: 10,
  },
  formInput: {
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#DAA520',
    borderRadius: 4,
    padding: 12,
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelFormButton: {
    flex: 1,
    backgroundColor: '#C4A57B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelFormButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveFormButton: {
    flex: 1,
    backgroundColor: '#DAA520',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveFormButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyCustomers: {
    padding: 26,
    alignItems: 'center',
  },
  emptyCustomersText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default OrdersScreen;
