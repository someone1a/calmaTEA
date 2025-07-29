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
import * as Notifications from 'expo-notifications';
import { AccessibleButton } from './AccessibleButton';
import { CircleCheck as CheckCircle, Circle, Trash2, Calendar, Clock, Bell, CreditCard as Edit3, X } from 'lucide-react-native';

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
  const [editSelectedDate, setEditSelectedDate] = React.useState('');
  const [editHasTimeLimit, setEditHasTimeLimit] = React.useState(false);
  const [editDueTimeString, setEditDueTimeString] = React.useState('');
  const [editHasReminder, setEditHasReminder] = React.useState(task.hasReminder);
  const [editSelectedReminder, setEditSelectedReminder] = React.useState<TaskReminder | null>(task.reminder || null);
  const [showEditCalendar, setShowEditCalendar] = React.useState(false);

  React.useEffect(() => {
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      setEditSelectedDate(date.toISOString().split('T')[0]);
      setEditHasTimeLimit(date.getHours() !== 23 || date.getMinutes() !== 59);
      setEditDueTimeString(formatTimeForInput(date));
    }
  }, [task.dueDate]);

  const presetReminders: TaskReminder[] = [
    { id: '1', type: 'preset', value: '10_minutes', label: '10 minutos antes' },
    { id: '2', type: 'preset', value: '30_minutes', label: '30 minutos antes' },
    { id: '3', type: 'preset', value: '1_hour', label: '1 hora antes' },
    { id: '4', type: 'preset', value: '1_day', label: '1 día antes' },
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

  const handleSaveEdit = async () => {
    let finalDueDate: Date | undefined = undefined;
    let finalReminder: TaskReminder | undefined = undefined;

    // Procesar fecha límite
    if (editHasDeadline && editSelectedDate) {
      const [year, month, day] = editSelectedDate.split('-').map(Number);
      if (editHasTimeLimit && editDueTimeString) {
        const [hours, minutes] = editDueTimeString.split(':').map(Number);
        finalDueDate = new Date(year, month - 1, day, hours, minutes);
      } else {
        // Si no tiene hora límite, establecer a las 23:59 del día seleccionado
        finalDueDate = new Date(year, month - 1, day, 23, 59);
      }
    }

    // Procesar recordatorio
    if (editHasReminder && finalDueDate && editSelectedReminder) {
      finalReminder = editSelectedReminder;
      
      // Programar notificación del recordatorio
      const reminderTime = calculateReminderTime(finalDueDate, editSelectedReminder);
      await showNotification(
        '¡Recordatorio de Tarea!',
        `La tarea "${editTitle}" vence ${finalReminder.label}`,
        reminderTime
      );
    }

    // Notificar cambios en la tarea
    await showNotification(
      'Tarea Actualizada',
      `La tarea "${editTitle}" ha sido actualizada${finalDueDate ? ` y vence el ${formatDueDate(finalDueDate)}` : ''}`
    );

    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
      dueDate: finalDueDate,
      hasReminder: editHasReminder,
      reminder: finalReminder,
    });

    setShowEditModal(false);
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleEditDateSelect = (day: any) => {
    setEditSelectedDate(day.dateString);
    setShowEditCalendar(false);
  };

  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const showNotification = async (title: string, body: string, trigger?: Date) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'notification.wav',
          data: { taskId: task.id },
        },
        trigger: trigger ? {
          date: trigger,
          seconds: 1,
        } : null,
      });
    } catch (error) {
      console.error('Error al programar notificación:', error);
    }
  };

  const calculateReminderTime = (dueDate: Date, reminder: TaskReminder): Date => {
    const reminderDate = new Date(dueDate);
    switch (reminder.value) {
      case '10_minutes':
        reminderDate.setMinutes(reminderDate.getMinutes() - 10);
        break;
      case '30_minutes':
        reminderDate.setMinutes(reminderDate.getMinutes() - 30);
        break;
      case '1_hour':
        reminderDate.setHours(reminderDate.getHours() - 1);
        break;
      case '1_day':
        reminderDate.setDate(reminderDate.getDate() - 1);
        break;
    }
    return reminderDate;
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
          onPress={async () => {
            // Mostrar notificación al completar/descompletar la tarea
            await showNotification(
              task.completed ? 'Tarea Pendiente' : 'Tarea Completada',
              task.completed
                ? `La tarea "${task.title}" ha sido marcada como pendiente`
                : `¡Felicidades! Has completado la tarea "${task.title}"`
            );
            onToggle(task.id);
          }}
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
                    setEditSelectedDate('');
                    setEditHasTimeLimit(false);
                    setEditDueTimeString('');
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
                  <Text style={styles.inputLabel}>Selecciona la fecha límite</Text>
                  <AccessibleButton
                    style={styles.datePickerButton}
                    onPress={() => setShowEditCalendar(true)}
                    accessibilityLabel="Abrir calendario para seleccionar fecha"
                  >
                    <Calendar size={20} color="#4CAF50" />
                    <Text style={styles.datePickerText}>
                      {editSelectedDate ? formatSelectedDate(editSelectedDate) : 'Seleccionar fecha'}
                    </Text>
                  </AccessibleButton>
                </View>

                {editSelectedDate && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>¿Tiene una hora límite específica?</Text>
                    <View style={styles.optionButtons}>
                      <AccessibleButton
                        style={[styles.optionButton, editHasTimeLimit && styles.selectedOption]}
                        onPress={() => setEditHasTimeLimit(true)}
                        accessibilityLabel="Sí, tiene hora límite"
                      >
                        <Text style={[styles.optionText, editHasTimeLimit && styles.selectedOptionText]}>
                          Sí
                        </Text>
                      </AccessibleButton>
                      <AccessibleButton
                        style={[styles.optionButton, !editHasTimeLimit && styles.selectedOption]}
                        onPress={() => {
                          setEditHasTimeLimit(false);
                          setEditDueTimeString('');
                        }}
                        accessibilityLabel="No, solo fecha"
                      >
                        <Text style={[styles.optionText, !editHasTimeLimit && styles.selectedOptionText]}>
                          No, solo fecha
                        </Text>
                      </AccessibleButton>
                    </View>
                  </View>
                )}

                {editHasTimeLimit && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Hora límite (HH:MM)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editDueTimeString}
                      onChangeText={setEditDueTimeString}
                      placeholder="14:30"
                      accessibilityLabel="Campo de hora límite"
                    />
                  </View>
                )}

                {editSelectedDate && (
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
                )}

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

      {/* Modal del calendario para edición */}
      <Modal
        visible={showEditCalendar}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditCalendar(false)}
      >
        <SafeAreaView style={styles.calendarModalContainer}>
          <View style={styles.calendarModalHeader}>
            <Text style={styles.calendarModalTitle}>Seleccionar Fecha</Text>
            <AccessibleButton
              style={styles.closeButton}
              onPress={() => setShowEditCalendar(false)}
              accessibilityLabel="Cerrar calendario"
            >
              <X size={24} color="#757575" />
            </AccessibleButton>
          </View>

          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleEditDateSelect}
              markedDates={{
                [editSelectedDate]: {
                  selected: true,
                  selectedColor: '#4CAF50',
                },
              }}
              minDate={getTodayString()}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#4CAF50',
                selectedDayBackgroundColor: '#4CAF50',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#4CAF50',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#4CAF50',
                selectedDotColor: '#ffffff',
                arrowColor: '#4CAF50',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: '#4CAF50',
                indicatorColor: '#4CAF50',
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              style={styles.calendar}
            />

            <View style={styles.calendarFooter}>
              <Text style={styles.calendarFooterText}>
                {editSelectedDate ? `Fecha seleccionada: ${formatSelectedDate(editSelectedDate)}` : 'Selecciona una fecha'}
              </Text>
            </View>
          </View>
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
  datePickerButton: {
    backgroundColor: '#F0F9F0',
    borderWidth: 2,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
    flex: 1,
  },
  calendarModalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  calendarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  calendarModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calendar: {
    borderRadius: 16,
    paddingBottom: 20,
  },
  calendarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E8',
    backgroundColor: '#F8FDF8',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  calendarFooterText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
  },
});