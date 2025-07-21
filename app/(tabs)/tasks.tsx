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
  Platform,
} from 'react-native';
import { AccessibleButton } from '@/components/AccessibleButton';
import { TaskCard } from '@/components/TaskCard';
import { useTasks } from '@/contexts/TasksContext';
import { Plus, X, Calendar, Clock, Bell } from 'lucide-react-native';

interface TaskReminder {
  id: string;
  type: 'preset' | 'custom';
  value: string;
  label: string;
  timestamp?: number;
}

export default function TasksScreen() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  
  // Estados para fecha límite y recordatorios
  const [hasDeadline, setHasDeadline] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueDateString, setDueDateString] = useState('');
  const [dueTimeString, setDueTimeString] = useState('');
  const [hasReminder, setHasReminder] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<TaskReminder | null>(null);
  const [showCustomReminder, setShowCustomReminder] = useState(false);
  const [customReminderAmount, setCustomReminderAmount] = useState('');
  const [customReminderUnit, setCustomReminderUnit] = useState('minutes');

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const presetReminders: TaskReminder[] = [
    { id: '1', type: 'preset', value: '1_day', label: '1 día antes' },
    { id: '2', type: 'preset', value: '1_hour', label: '1 hora antes' },
  ];

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    let finalDueDate: Date | null = null;
    let finalReminder: TaskReminder | undefined = undefined;

    // Procesar fecha límite
    if (hasDeadline && dueDateString && dueTimeString) {
      const [day, month, year] = dueDateString.split('/').map(Number);
      const [hours, minutes] = dueTimeString.split(':').map(Number);
      finalDueDate = new Date(year, month - 1, day, hours, minutes);
    }

    // Procesar recordatorio
    if (hasReminder && finalDueDate) {
      if (showCustomReminder && customReminderAmount) {
        finalReminder = {
          id: Date.now().toString(),
          type: 'custom',
          value: `${customReminderAmount}_${customReminderUnit}`,
          label: `${customReminderAmount} ${customReminderUnit === 'minutes' ? 'minutos' : 
                   customReminderUnit === 'hours' ? 'horas' : 'días'} antes`,
        };
      } else if (selectedReminder) {
        finalReminder = selectedReminder;
      }
    }

    addTask(newTaskTitle.trim(), newTaskDescription.trim(), finalDueDate || undefined, finalReminder);
    resetForm();
  };

  const resetForm = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setHasDeadline(false);
    setDueDate(null);
    setDueDateString('');
    setDueTimeString('');
    setHasReminder(false);
    setSelectedReminder(null);
    setShowCustomReminder(false);
    setCustomReminderAmount('');
    setCustomReminderUnit('minutes');
    setShowAddModal(false);
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

  const formatDateForInput = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
                onUpdate={updateTask}
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
              onPress={resetForm}
              accessibilityLabel="Cerrar formulario de agregar tarea"
            >
              <X size={24} color="#757575" />
            </AccessibleButton>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
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

            {/* Pregunta sobre fecha límite */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>¿La tarea tiene una fecha límite?</Text>
              <View style={styles.optionButtons}>
                <AccessibleButton
                  style={[styles.optionButton, hasDeadline && styles.selectedOption]}
                  onPress={() => setHasDeadline(true)}
                  accessibilityLabel="Sí, tiene fecha límite"
                >
                  <Text style={[styles.optionText, hasDeadline && styles.selectedOptionText]}>
                    Sí
                  </Text>
                </AccessibleButton>
                <AccessibleButton
                  style={[styles.optionButton, !hasDeadline && styles.selectedOption]}
                  onPress={() => {
                    setHasDeadline(false);
                    setHasReminder(false);
                  }}
                  accessibilityLabel="No, sin fecha límite"
                >
                  <Text style={[styles.optionText, !hasDeadline && styles.selectedOptionText]}>
                    No
                  </Text>
                </AccessibleButton>
              </View>
            </View>

            {/* Campos de fecha y hora si tiene deadline */}
            {hasDeadline && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Fecha de vencimiento (DD/MM/AAAA)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dueDateString}
                    onChangeText={setDueDateString}
                    placeholder="25/12/2024"
                    accessibilityLabel="Campo de fecha de vencimiento"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hora de vencimiento (HH:MM)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dueTimeString}
                    onChangeText={setDueTimeString}
                    placeholder="14:30"
                    accessibilityLabel="Campo de hora de vencimiento"
                  />
                </View>

                {/* Pregunta sobre recordatorio */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>¿Querés que te recuerde esta tarea?</Text>
                  <View style={styles.optionButtons}>
                    <AccessibleButton
                      style={[styles.optionButton, hasReminder && styles.selectedOption]}
                      onPress={() => setHasReminder(true)}
                      accessibilityLabel="Sí, quiero recordatorio"
                    >
                      <Text style={[styles.optionText, hasReminder && styles.selectedOptionText]}>
                        Sí
                      </Text>
                    </AccessibleButton>
                    <AccessibleButton
                      style={[styles.optionButton, !hasReminder && styles.selectedOption]}
                      onPress={() => setHasReminder(false)}
                      accessibilityLabel="No, sin recordatorio"
                    >
                      <Text style={[styles.optionText, !hasReminder && styles.selectedOptionText]}>
                        No
                      </Text>
                    </AccessibleButton>
                  </View>
                </View>

                {/* Opciones de recordatorio */}
                {hasReminder && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Opciones de recordatorio</Text>
                    
                    {/* Recordatorios predefinidos */}
                    <View style={styles.reminderOptions}>
                      {presetReminders.map((reminder) => (
                        <AccessibleButton
                          key={reminder.id}
                          style={[
                            styles.reminderOption,
                            selectedReminder?.id === reminder.id && !showCustomReminder && styles.selectedReminder
                          ]}
                          onPress={() => {
                            setSelectedReminder(reminder);
                            setShowCustomReminder(false);
                          }}
                          accessibilityLabel={`Recordatorio ${reminder.label}`}
                        >
                          <Bell size={16} color={selectedReminder?.id === reminder.id && !showCustomReminder ? '#FFFFFF' : '#4CAF50'} />
                          <Text style={[
                            styles.reminderOptionText,
                            selectedReminder?.id === reminder.id && !showCustomReminder && styles.selectedReminderText
                          ]}>
                            {reminder.label}
                          </Text>
                        </AccessibleButton>
                      ))}
                      
                      {/* Opción personalizada */}
                      <AccessibleButton
                        style={[
                          styles.reminderOption,
                          showCustomReminder && styles.selectedReminder
                        ]}
                        onPress={() => setShowCustomReminder(true)}
                        accessibilityLabel="Personalizar recordatorio"
                      >
                        <Clock size={16} color={showCustomReminder ? '#FFFFFF' : '#4CAF50'} />
                        <Text style={[
                          styles.reminderOptionText,
                          showCustomReminder && styles.selectedReminderText
                        ]}>
                          Personalizar
                        </Text>
                      </AccessibleButton>
                    </View>

                    {/* Campos para recordatorio personalizado */}
                    {showCustomReminder && (
                      <View style={styles.customReminderContainer}>
                        <Text style={styles.customReminderLabel}>Recordar:</Text>
                        <View style={styles.customReminderInputs}>
                          <TextInput
                            style={styles.customReminderAmount}
                            value={customReminderAmount}
                            onChangeText={setCustomReminderAmount}
                            placeholder="30"
                            keyboardType="numeric"
                            accessibilityLabel="Cantidad para recordatorio personalizado"
                          />
                          <View style={styles.customReminderUnit}>
                            <AccessibleButton
                              style={[
                                styles.unitButton,
                                customReminderUnit === 'minutes' && styles.selectedUnit
                              ]}
                              onPress={() => setCustomReminderUnit('minutes')}
                            >
                              <Text style={[
                                styles.unitButtonText,
                                customReminderUnit === 'minutes' && styles.selectedUnitText
                              ]}>
                                min
                              </Text>
                            </AccessibleButton>
                            <AccessibleButton
                              style={[
                                styles.unitButton,
                                customReminderUnit === 'hours' && styles.selectedUnit
                              ]}
                              onPress={() => setCustomReminderUnit('hours')}
                            >
                              <Text style={[
                                styles.unitButtonText,
                                customReminderUnit === 'hours' && styles.selectedUnitText
                              ]}>
                                hrs
                              </Text>
                            </AccessibleButton>
                            <AccessibleButton
                              style={[
                                styles.unitButton,
                                customReminderUnit === 'days' && styles.selectedUnit
                              ]}
                              onPress={() => setCustomReminderUnit('days')}
                            >
                              <Text style={[
                                styles.unitButtonText,
                                customReminderUnit === 'days' && styles.selectedUnitText
                              ]}>
                                días
                              </Text>
                            </AccessibleButton>
                          </View>
                        </View>
                        <Text style={styles.customReminderPreview}>
                          antes de la fecha límite
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </>
            )}

            <View style={styles.modalButtons}>
              <AccessibleButton
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetForm}
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
          </ScrollView>
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
  optionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  reminderOptions: {
    gap: 12,
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F0',
    borderWidth: 2,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  selectedReminder: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  reminderOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  selectedReminderText: {
    color: '#FFFFFF',
  },
  customReminderContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  customReminderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  customReminderInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  customReminderAmount: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    width: 80,
    textAlign: 'center',
  },
  customReminderUnit: {
    flexDirection: 'row',
    gap: 4,
  },
  unitButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedUnit: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  selectedUnitText: {
    color: '#FFFFFF',
  },
  customReminderPreview: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 20,
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