import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {DishCategory, Dish} from '../types';
import {formatPrice} from '../utils/sampleData';

const DishesScreen: React.FC = () => {
  const {addDish, updateDish, deleteDish, getDishesByCategory} = useApp();
  const [selectedCategory, setSelectedCategory] = useState<DishCategory>(
    DishCategory.DESAYUNO
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const categories = [
    DishCategory.DESAYUNO,
    DishCategory.ALMUERZO,
    DishCategory.BEBESTIBLES,
    DishCategory.OTROS,
  ];

  const handleOpenModal = (dish?: Dish) => {
    console.log('handleOpenModal called with dish:', dish);
    if (dish) {
      setEditingDish(dish);
      setFormData({
        name: dish.name,
        description: dish.description,
        price: dish.price.toString(),
      });
    } else {
      setEditingDish(null);
      setFormData({name: '', description: '', price: ''});
    }
    console.log('Setting modalVisible to true');
    setModalVisible(true);
  };

  const handleSaveDish = async () => {
    console.log('handleSaveDish called');
    if (!formData.name || !formData.price) {
      Alert.alert('Error', 'El nombre y el precio son obligatorios');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido mayor a 0');
      return;
    }

    const dishData: Dish = {
      id: editingDish?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: price,
      category: selectedCategory,
    };

    if (editingDish) {
      console.log('Updating dish:', dishData);
      await updateDish(dishData);
      Alert.alert('Plato actualizado', `${dishData.name} ha sido actualizado correctamente`);
    } else {
      console.log('Adding dish:', dishData);
      await addDish(dishData);
      Alert.alert('Plato creado', `${dishData.name} ha sido agregado al menú`);
    }

    setModalVisible(false);
    setFormData({name: '', description: '', price: ''});
  };

  const handleDeleteDish = (dish: Dish) => {
    Alert.alert(
      'Eliminar Plato',
      `¿Estás seguro de eliminar "${dish.name}"?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDish(dish.id);
            Alert.alert('Eliminado', `${dish.name} ha sido eliminado`);
          },
        },
      ]
    );
  };

  const categoryDishes = getDishesByCategory(selectedCategory);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Platos</Text>
      </View>

      {/* Categorías */}
      <View style={styles.categoriesContainer}>
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

      {/* Lista de Platos */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {categoryDishes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No hay platos en esta categoría
            </Text>
            <Text style={styles.emptySubtext}>
              Toca el botón + para agregar uno
            </Text>
          </View>
        ) : (
          <View style={styles.dishGrid}>
            {categoryDishes.map(dish => (
              <View key={dish.id} style={styles.dishCard}>
                <View style={styles.dishInfo}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <Text style={styles.dishDescription}>{dish.description}</Text>
                  <Text style={styles.dishPrice}>${formatPrice(dish.price)}</Text>
                </View>
                <View style={styles.dishActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      console.log('EDIT PRESSED FOR:', dish.name);
                      handleOpenModal(dish);
                    }}>
                    <Text style={styles.editButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      console.log('DELETE PRESSED FOR:', dish.name);
                      handleDeleteDish(dish);
                    }}>
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Botón Agregar */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log('ADD BUTTON PRESSED');
          handleOpenModal();
        }}>
        <Text style={styles.addButtonText}>+ Agregar Plato</Text>
      </TouchableOpacity>
    </SafeAreaView>

    {/* Modal de Formulario - FUERA de SafeAreaView */}
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingDish ? 'Editar Plato' : 'Nuevo Plato'}
          </Text>

          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={text => setFormData({...formData, name: text})}
            placeholder="Ej: Café con leche"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={text => setFormData({...formData, description: text})}
            placeholder="Ej: Café con leche y pan tostado"
            multiline
            numberOfLines={2}
          />

          <Text style={styles.label}>Precio *</Text>
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={text => setFormData({...formData, price: text})}
            placeholder="Ej: 2500"
            keyboardType="numeric"
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveDish}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A67C52', // Café medio claro
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryButton: {
    flex: 1,
    minWidth: '22%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  categoryButtonActive: {
    borderColor: '#DAA520', // Dorado brillante
    backgroundColor: '#DAA520',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#A67C52',
    fontWeight: '700',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  dishGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
  },
  dishCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
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
  dishDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  dishPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E6A45D', // Dorado cálido
  },
  dishActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    padding: 2,
  },
  editButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 2,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#DAA520', // Dorado brillante
    margin: 12,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E6A45D', // Dorado cálido
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DishesScreen;
