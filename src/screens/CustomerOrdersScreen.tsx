import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
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
  const {getOrdersByCustomer, completeOrder, cancelOrder, updateOrderPaymentStatus} = useApp();
  
  const customerOrders = getOrdersByCustomer(customerName);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{customerName}</Text>
            <Text style={styles.subtitle}>{customerLocal}</Text>
          </View>
          <Pressable
            style={styles.addOrderButton}
            onPress={() => {
              (navigation as any).navigate('NewCustomerOrder', {
                customerName,
                customerLocal,
              });
            }}>
            <Text style={styles.addOrderButtonText}>+</Text>
          </Pressable>
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

                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>
                      Total: ${formatPrice(order.total)}
                    </Text>
                  </View>

                  <View style={styles.paymentStatus}>
                    <Pressable
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
                    </Pressable>
                  </View>

                  <View style={styles.orderActions}>
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
                    </Pressable>
                    <Pressable
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
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
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
});

export default CustomerOrdersScreen;
