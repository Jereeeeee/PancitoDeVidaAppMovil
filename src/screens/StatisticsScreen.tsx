import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {formatPrice} from '../utils/sampleData';

const StatisticsScreen: React.FC = () => {
  const {getTodayStats, getWeeklyStats, getMonthlyStats, getAnnualStats, orders, frequentCustomers} = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const getStats = () => {
    switch (selectedPeriod) {
      case 'week':
        return getWeeklyStats();
      case 'month':
        return getMonthlyStats();
      case 'year':
        return getAnnualStats();
      default:
        return getTodayStats();
    }
  };

  const stats = getStats();

  // Obtener clientes con deudas
  const getCustomersWithDebts = () => {
    return frequentCustomers
      .map(customer => {
        // Obtener todas las órdenes del cliente (completadas o no) que no están pagadas
        const unpaidOrders = orders.filter(o => o.customerName === customer.name && !o.paid);
        const totalDebt = unpaidOrders.reduce((sum, order) => sum + order.total, 0);
        return {
          id: customer.id,
          name: customer.name,
          local: customer.local,
          totalDebt,
          unpaidOrders: unpaidOrders.length,
        };
      })
      .filter(customer => customer.unpaidOrders > 0)
      .sort((a, b) => b.totalDebt - a.totalDebt);
  };

  const customersWithDebts = getCustomersWithDebts();

  const periodNames = {
    day: 'Diario',
    week: 'Semanal',
    month: 'Mensual',
    year: 'Anual',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estadísticas</Text>
        <Text style={styles.subtitle}>Reporte {periodNames[selectedPeriod]}</Text>
      </View>

      {/* Botones de Período */}
      <View style={styles.periodSelector}>
        {(['day', 'week', 'month', 'year'] as const).map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}>
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}>
              {periodNames[period]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {/* Resumen de Ventas */}
        <View style={styles.summaryContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Ventas</Text>
            <Text style={styles.statValue}>${formatPrice(stats.totalSales)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pedidos</Text>
            <Text style={styles.statValue}>{stats.ordersCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Promedio</Text>
            <Text style={styles.statValue}>
              ${stats.ordersCount > 0 ? formatPrice(stats.totalSales / stats.ordersCount) : '0'}
            </Text>
          </View>
        </View>

        {/* Platos Más Vendidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top 5 Platos Más Vendidos</Text>
          
          {stats.topDishes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No hay ventas registradas hoy
              </Text>
            </View>
          ) : (
            stats.topDishes.map((item, index) => (
              <View key={item.dish.id} style={styles.dishRankCard}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.dishRankInfo}>
                  <Text style={styles.dishRankName}>{item.dish.name}</Text>
                  <Text style={styles.dishRankCategory}>{item.dish.category}</Text>
                </View>
                <View style={styles.dishRankStats}>
                  <Text style={styles.dishRankQuantity}>{item.quantity} vendidos</Text>
                  <Text style={styles.dishRankRevenue}>
                    ${formatPrice(item.dish.price * item.quantity)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Información Adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedPeriod === 'day' ? 'Información del Día' : 
             selectedPeriod === 'week' ? 'Información de la Semana' :
             selectedPeriod === 'month' ? 'Información del Mes' :
             'Información del Año'}
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Período:</Text>
            <Text style={styles.infoValue}>{stats.date}</Text>
          </View>
          
          {stats.topDishes.length > 0 && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Plato más vendido:</Text>
                <Text style={styles.infoValue}>{stats.topDishes[0].dish.name}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Categoría más popular:</Text>
                <Text style={styles.infoValue}>{stats.topDishes[0].dish.category}</Text>
              </View>
            </>
          )}
        </View>

        {/* Clientes Frecuentes con Deudas - Contenedor Destacado */}
        {customersWithDebts.length > 0 && (
          <View style={styles.debtSection}>
            <View style={styles.debtSectionHeader}>
              <Text style={styles.debtSectionTitle}>⚠️ CLIENTES EN DEBE</Text>
              <Text style={styles.debtCount}>{customersWithDebts.length}</Text>
            </View>
            <View style={styles.debtCardsContainer}>
              {customersWithDebts.map((customer) => (
                <View key={customer.id} style={styles.debtCard}>
                  <View style={styles.debtCardContent}>
                    <View style={styles.debtInfo}>
                      <Text style={styles.debtCustomerName}>{customer.name}</Text>
                      <Text style={styles.debtCustomerLocal}>{customer.local}</Text>
                      <Text style={styles.debtOrdersInfo}>
                        {customer.unpaidOrders} pedido{customer.unpaidOrders !== 1 ? 's' : ''} pendiente{customer.unpaidOrders !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <View style={styles.debtAmountBox}>
                      <Text style={styles.debtValueLabel}>Debe</Text>
                      <Text style={styles.debtValue}>${formatPrice(customer.totalDebt)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
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
  subtitle: {
    fontSize: 15,
    color: '#C4A57B',
    marginTop: 2,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#DAA520',
    borderColor: '#DAA520',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A67C52',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E6A45D', // Dorado cálido
  },
  section: {
    backgroundColor: '#fff',
    margin: 12,
    marginTop: 6,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A67C52', // Café medio claro
    marginBottom: 10,
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
  dishRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DAA520', // Dorado brillante
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dishRankInfo: {
    flex: 1,
  },
  dishRankName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dishRankCategory: {
    fontSize: 13,
    color: '#C4A57B', // Café con leche
  },
  dishRankStats: {
    alignItems: 'flex-end',
  },
  dishRankQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dishRankRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E6A45D', // Dorado cálido
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  debtCard: {
    backgroundColor: '#fff9f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D2691E',
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtInfo: {
    flex: 1,
  },
  debtCustomerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  debtCustomerLocal: {
    fontSize: 13,
    color: '#666',
  },
  debtAmount: {
    alignItems: 'flex-end',
  },
  debtValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2691E',
  },
  debtOrders: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  debtSection: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#FF6B35',
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  debtSectionHeader: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  debtCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  debtCardsContainer: {
    padding: 12,
  },
  debtCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#FF6B35',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  debtCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtInfo: {
    flex: 1,
  },
  debtCustomerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  debtCustomerLocal: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  debtOrdersInfo: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  debtAmountBox: {
    backgroundColor: '#FFE0D5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 90,
  },
  debtValueLabel: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 2,
  },
  debtValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
});

export default StatisticsScreen;
