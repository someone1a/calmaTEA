import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { AccessibleButton } from '@/components/AccessibleButton';
import { TaskCard } from '@/components/TaskCard';
import { useTasks } from '@/contexts/TasksContext';
import { Plus, X } from 'lucide-react-native';

export default function TasksScreen() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), newTaskDescription.trim());
      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowAddModal(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteTask(taskId) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tareas Pendientes</Text>
        <Text style={styles.headerSubtitle}>
          Rastrea tus actividades diarias
        </Text>
        
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {completedTasks} de {totalTasks} completadas
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              ¡No hay tareas todavía! Agrega tu primera tarea para empezar.
            </Text>
          </View>
        ) : (
          <View style={styles.tasksList}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AccessibleButton
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
          accessibilityLabel="Agregar nueva tarea"
          accessibilityHint="Abre formulario para crear una nueva tarea"
        >
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Agregar Tarea</Text>
        </AccessibleButton>
      </View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agregar Nueva Tarea</Text>
            <AccessibleButton
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
              accessibilityLabel="Cerrar formulario de agregar tarea"
            >
              <X size={24} color="#757575" />
            </AccessibleButton>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título de la Tarea *</Text>
              <TextInput
                style={styles.textInput}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="Ingresa el título de la tarea"
                accessibilityLabel="Campo de título de tarea"
                accessibilityHint="Ingresa el título para tu nueva tarea"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                placeholder="Ingresa la descripción de la tarea"
                multiline
                numberOfLines={3}
                accessibilityLabel="Campo de descripción de tarea"
                accessibilityHint="Ingresa una descripción opcional para tu tarea"
              />
            </View>

            <View style={styles.modalButtons}>
              <AccessibleButton
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
                accessibilityLabel="Cancelar agregar tarea"
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </AccessibleButton>

              <AccessibleButton
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTask}
                accessibilityLabel="Guardar nueva tarea"
                accessibilityHint="Guarda la tarea y cierra el formulario"
              >
                <Text style={styles.saveButtonText}>Agregar Tarea</Text>
              </AccessibleButton>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#FFF3E0',
    borderBottomWidth: 1,
    borderBottomColor: '#FFCC02',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#F57C00',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  progressSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    fontWeight: '500',
  },
  tasksList: {
    gap: 12,
  },
  footer: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});