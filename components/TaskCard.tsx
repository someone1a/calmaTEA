import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { CircleCheck as CheckCircle, Circle, Trash2, Calendar, Clock, Bell, Edit3, X } from 'lucide-react-native';

interface TaskReminder {
  id: string;
  type: 'preset' | 'custom';
  value: string;
  label: string;
  timestamp?: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  hasReminder: boolean;
  reminder?: TaskReminder;
}

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(task.title);
  const [editDescription, setEditDescription] = React.useState(task.description);
  const [editHasDeadline, setEditHasDeadline] = React.useState(!!task.dueDate);
  const [editDueDateString, setEditDueDateString] = React.useState('');
  const [editDueTimeString, setEditDueTimeString] = React.useState('');
  const [editHasReminder, setEditHasReminder] = React.useState(task.hasReminder);
  const [editSelectedReminder, setEditSelectedReminder] = React.useState<TaskReminder | null>(task.reminder || null);

  React.useEffect(() => {
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      setEditDueDateString(formatDateForInput(date));
      setEditDueTimeString(formatTimeForInput(date));
    }
  }, [task.dueDate]);

  const presetReminders: TaskReminder[] = [
    { id: '1', type: 'preset', value: '1_day', label: '1 día antes' },
    { id: '2', type: 'preset', value: '1_hour', label: '1 hora antes' },
  ];

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(task.id) },
      ]
    );
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    let finalDueDate: Date | undefined = undefined;
    let finalReminder: TaskReminder | undefined = undefined;

    // Procesar fecha límite
    if (editHasDeadline && editDueDateString && editDueTimeString) {
      const [day, month, year] = editDueDateString.split('/').map(Number);
      const [hours, minutes] = editDueTimeString.split(':').map(Number);
      finalDueDate = new Date(year, month - 1, day, hours, minutes);
    }

    // Procesar recordatorio
    if (editHasReminder && finalDueDate && editSelectedReminder) {
      finalReminder = editSelectedReminder;
    }

    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
      dueDate: finalDueDate,
      hasReminder: editHasReminder,
      reminder: finalReminder,
    });

    setShowEditModal(false);
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

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const dateStr = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (diffDays < 0) {
      return `Vencida - ${dateStr} ${timeStr}`;
    } else if (diffDays === 0) {
      return `Hoy - ${timeStr}`;
    } else if (diffDays === 1) {
      return `Mañana - ${timeStr}`;
    } else {
      return `${dateStr} ${timeStr}`;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <>
      <View style={[
        styles.container, 
        task.completed && styles.completedContainer,
        isOverdue && styles.overdueContainer
      ]}>
        <AccessibleButton
          style={styles.checkButton}
          onPress={() => onToggle(task.id)}
          accessibilityLabel={task.completed ? 'Marcar tarea como incompleta' : 'Marcar tarea como completa'}
          accessibilityHint={`Cambiar estado de completado para ${task.title}`}
        >
          {task.completed ? (
            <CheckCircle size={24} color="#4CAF50" />
          ) : (
            <Circle size={24} color="#757575" />
          )}
        </AccessibleButton>

        <View style={styles.taskContent}>
          <Text style={[styles.title, task.completed && styles.completedTitle]}>
            {task.title}
          </Text>
          {task.description && (
            <Text style={[styles.description, task.completed && styles.completedDescription]}>
              {task.description}
            </Text>
          )}
          
          {/* Información de fecha límite */}
          {task.dueDate && (
            <View style={styles.dueDateContainer}>
              <Calendar size={14} color={isOverdue ? "#F44336" : "#666666"} />
              <Text style={[
                styles.dueDateText,
                isOverdue && styles.overdueText,
                task.completed && styles.completedDescription
              ]}>
                {formatDueDate(new Date(task.dueDate))}
              </Text>
            </View>
          )}
          
          {/* Información de recordatorio */}
          {task.hasReminder && task.reminder && (
            <View style={styles.reminderContainer}>
              <Bell size={14} color="#4CAF50" />
              <Text style={[styles.reminderText, task.completed && styles.completedDescription]}>
                Recordatorio: {task.reminder.label}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <AccessibleButton
            style={styles.editButton}
            onPress={handleEdit}
            accessibilityLabel="Editar tarea"
            accessibilityHint={`Editar la tarea: ${task.title}`}
          >
            <Edit3 size={18} color="#2196F3" />
          </AccessibleButton>
          
          <AccessibleButton
            style={styles.deleteButton}
            onPress={handleDelete}
            accessibilityLabel="Eliminar tarea"
            accessibilityHint={`Eliminar la tarea: ${task.title}`}
          >
            <Trash2 size={18} color="#F44336" />
          </AccessibleButton>
        </View>
      </View>

      {/* Modal de edición */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Tarea</Text>
            <AccessibleButton
              style={styles.closeButton}
              onPress={() => setShowEditModal(false)}
              accessibilityLabel="Cerrar formulario de edición"
            >
              <X size={24} color="#757575" />
            </AccessibleButton>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título de la Tarea *</Text>
              <TextInput
                style={styles.textInput}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Título de la tarea"
                accessibilityLabel="Campo de título de tarea"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="Descripción de la tarea"
                multiline
                numberOfLines={3}
                accessibilityLabel="Campo de descripción de tarea"
              />
            </View>

            {/* Fecha límite */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>¿Tiene fecha límite?</Text>
              <View style={styles.optionButtons}>
                <AccessibleButton
                  style={[styles.optionButton, editHasDeadline && styles.selectedOption]}
                  onPress={() => setEditHasDeadline(true)}
                >
                  <Text style={[styles.optionText, editHasDeadline && styles.selectedOptionText]}>
                    Sí
                  </Text>
                </AccessibleButton>
                <AccessibleButton
                  style={[styles.optionButton, !editHasDeadline && styles.selectedOption]}
                  onPress={() => {
                    setEditHasDeadline(false);
                    setEditHasReminder(false);
                  }}
                >
                  <Text style={[styles.optionText, !editHasDeadline && styles.selectedOptionText]}>
                    No
                  </Text>
                </AccessibleButton>
              </View>
            </View>

            {editHasDeadline && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Fecha (DD/MM/AAAA)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editDueDateString}
                    onChangeText={setEditDueDateString}
                    placeholder="25/12/2024"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hora (HH:MM)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editDueTimeString}
                    onChangeText={setEditDueTimeString}
                    placeholder="14:30"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>¿Recordatorio?</Text>
                  <View style={styles.optionButtons}>
                    <AccessibleButton
                      style={[styles.optionButton, editHasReminder && styles.selectedOption]}
                      onPress={() => setEditHasReminder(true)}
                    >
                      <Text style={[styles.optionText, editHasReminder && styles.selectedOptionText]}>
                        Sí
                      </Text>
                    </AccessibleButton>
                    <AccessibleButton
                      style={[styles.optionButton, !editHasReminder && styles.selectedOption]}
                      onPress={() => setEditHasReminder(false)}
                    >
                      <Text style={[styles.optionText, !editHasReminder && styles.selectedOptionText]}>
                        No
                      </Text>
                    </AccessibleButton>
                  </View>
                </View>

                {editHasReminder && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Opciones de recordatorio</Text>
                    <View style={styles.reminderOptions}>
                      {presetReminders.map((reminder) => (
                        <AccessibleButton
                          key={reminder.id}
                          style={[
                            styles.reminderOption,
                            editSelectedReminder?.id === reminder.id && styles.selectedReminder
                          ]}
                          onPress={() => setEditSelectedReminder(reminder)}
                        >
                          <Bell size={16} color={editSelectedReminder?.id === reminder.id ? '#FFFFFF' : '#4CAF50'} />
                          <Text style={[
                            styles.reminderOptionText,
                            editSelectedReminder?.id === reminder.id && styles.selectedReminderText
                          ]}>
                            {reminder.label}
                          </Text>
                        </AccessibleButton>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}

            <View style={styles.modalButtons}>
              <AccessibleButton
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </AccessibleButton>

              <AccessibleButton
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </AccessibleButton>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  completedContainer: {
    backgroundColor: '#F8F9FA',
    borderLeftColor: '#4CAF50',
  },
  overdueContainer: {
    borderLeftColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  checkButton: {
    padding: 8,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
    marginBottom: 8,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  overdueText: {
    color: '#F44336',
    fontWeight: '600',
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reminderText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
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