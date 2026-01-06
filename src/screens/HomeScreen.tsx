import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { getVersiculoDelDia } from '../utils/versiculos';
import { exportAllData, importDataFromJSON } from '../utils/dataBackup';
import { useApp } from '../context/AppContext';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const appContext = useApp();
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    // Forzar actualización cuando refreshKey cambia
    // Los datos ya están guardados en AsyncStorage
  }, [refreshKey]);
  
  const versiculoDelDia = getVersiculoDelDia();
  const menuItems = [
    {
      title: 'Ver Pedidos',
      description: 'Gestiona los pedidos de las mesas',
      onPress: () => navigation.navigate('Orders'),
      color: '#E6A45D', // Dorado cálido
    },
    {
      title: 'Nuevo Pedido',
      description: 'Crear un nuevo pedido',
      onPress: () => navigation.navigate('NewOrder'),
      color: '#DAA520', // Dorado brillante
    },
    {
      title: 'Gestionar Platos',
      description: 'Administrar menú y platos',
      onPress: () => navigation.navigate('Dishes'),
      color: '#CD853F', // Dorado oscuro
    },
    {
      title: 'Estadísticas',
      description: 'Ver reportes y ventas',
      onPress: () => navigation.navigate('Statistics'),
      color: '#C4A57B', // Café con leche
    },
  ];

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const result = await exportAllData();
      if (result) {
        Alert.alert(
          '✅ Respaldo Exitoso',
          'Los datos se han exportado correctamente. Puedes encontrar el archivo en la carpeta Descargas o compartirlo por email.',
          [{text: 'OK', onPress: () => setBackupModalVisible(false)}]
        );
      }
    } catch (error) {
      Alert.alert('❌ Error', `No se pudo exportar los datos: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    if (!importText.trim()) {
      Alert.alert('⚠️ Error', 'Por favor, pega el contenido del archivo JSON de respaldo');
      return;
    }

    setIsImporting(true);
    try {
      const result = await importDataFromJSON(importText);
      if (result) {
        // Cerrar modales primero
        setImportModalVisible(false);
        setBackupModalVisible(false);
        setImportText('');
        setIsImporting(false);
        
        // Recargar todos los datos del contexto
        await appContext.reloadAllData();
        
        // Mostrar mensaje de éxito
        Alert.alert(
          '✅ Importación Exitosa',
          'Los datos se han importado correctamente y la pantalla se ha actualizado.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Forzar recarga del componente
                setRefreshKey(prev => prev + 1);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('❌ Error', `No se pudo importar los datos: ${error}`);
      setIsImporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🥖 Pancito de Vida</Text>
        <Text style={styles.subtitle}>La mejor comida de Iquique</Text>
        <TouchableOpacity 
          style={styles.backupButton}
          onPress={() => setBackupModalVisible(true)}>
          <Text style={styles.backupButtonText}>💾 Respaldo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, {backgroundColor: item.color}]}
              onPress={item.onPress}
              activeOpacity={0.7}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Versículo del Día */}
        <View style={styles.versiculoContainer}>
          <Text style={styles.versiculoTitulo}>✨ Pancito del Día ✨</Text>
          <Text style={styles.versiculoTexto}>"{versiculoDelDia.texto}"</Text>
          <Text style={styles.versiculoReferencia}>- {versiculoDelDia.referencia}</Text>
        </View>
      </View>

      {/* Modal de Backup */}
      <Modal
        visible={backupModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBackupModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.backupModal}>
            <Text style={styles.modalTitle}>💾 Respaldar Datos</Text>
            
            <Text style={styles.modalDescription}>
              Exporta todos tus datos (pedidos, platos, clientes frecuentes y estadísticas) antes de desinstalar o actualizar la aplicación.
            </Text>

            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>⚠️ Importante</Text>
              <Text style={styles.warningText}>
                Si desinstalas la app sin respaldar los datos, toda la información se perderá permanentemente.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
              onPress={handleExportData}
              disabled={isExporting}>
              <Text style={styles.exportButtonText}>
                {isExporting ? '⏳ Exportando...' : '📥 Exportar Datos'}
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={[styles.importButton, isImporting && styles.importButtonDisabled]}
              onPress={() => {
                setBackupModalVisible(false);
                setImportModalVisible(true);
              }}
              disabled={isImporting}>
              <Text style={styles.importButtonText}>📤 Importar Datos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setBackupModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>📋 Qué se exporta:</Text>
              <Text style={styles.infoItem}>• Todos los platos del menú</Text>
              <Text style={styles.infoItem}>• Historial de pedidos</Text>
              <Text style={styles.infoItem}>• Clientes frecuentes</Text>
              <Text style={styles.infoItem}>• Estadísticas de ventas</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Importar */}
      <Modal
        visible={importModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setImportModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.backupModal}>
            <Text style={styles.modalTitle}>📤 Importar Datos</Text>
            
            <Text style={styles.modalDescription}>
              Pega aquí el contenido del archivo JSON de respaldo que exportaste previamente.
            </Text>

            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>⚠️ Advertencia</Text>
              <Text style={styles.warningText}>
                Esta acción reemplazará TODOS los datos actuales con los datos del respaldo.
              </Text>
            </View>

            <TextInput
              style={styles.jsonInput}
              multiline
              placeholder="Pega aquí el contenido JSON del respaldo..."
              value={importText}
              onChangeText={setImportText}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.importButton, (isImporting || !importText.trim()) && styles.importButtonDisabled]}
              onPress={handleImportData}
              disabled={isImporting || !importText.trim()}>
              <Text style={styles.importButtonText}>
                {isImporting ? '⏳ Importando...' : '✅ Confirmar Importación'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setImportModalVisible(false);
                setImportText('');
              }}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>💡 Cómo obtener el JSON:</Text>
              <Text style={styles.infoItem}>1. Abre el archivo de respaldo (.json)</Text>
              <Text style={styles.infoItem}>2. Copia todo el contenido</Text>
              <Text style={styles.infoItem}>3. Pega en el cuadro de texto arriba</Text>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A67C52', // Café medio claro
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#D2855D', // Terracota suave
    fontWeight: '500',
    marginBottom: 10,
  },
  backupButton: {
    backgroundColor: '#CD853F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 14,
    paddingBottom: 18,
    justifyContent: 'space-between',
  },
  versiculoContainer: {
    backgroundColor: '#FFFAF0', // Marfil muy claro
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DAA520', // Dorado
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 14,
  },
  versiculoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A67C52',
    textAlign: 'center',
    marginBottom: 6,
  },
  versiculoTexto: {
    fontSize: 17,
    color: '#8B6F47',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 6,
  },
  versiculoReferencia: {
    fontSize: 14,
    color: '#CD853F',
    fontWeight: '600',
    textAlign: 'right',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    minHeight: 120,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backupModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A67C52',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
  },
  jsonInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    maxHeight: 250,
    backgroundColor: '#F9F9F9',
    fontFamily: 'monospace',
    fontSize: 12,
    marginVertical: 12,
  },
  urlInput: {
    minHeight: 52,
    maxHeight: 52,
    textAlignVertical: 'center',
  },
  exportButton: {
    backgroundColor: '#CD853F',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  importButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#45A049',
  },
  importButtonDisabled: {
    opacity: 0.6,
  },
  importButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A67C52',
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default HomeScreen;
