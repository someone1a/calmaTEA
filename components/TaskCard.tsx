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

// Configuración para que las notificaciones se muestren en primer y segundo plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

  // Solicitar permisos al cargar el componente
  React.useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    requestPermissions();
  }, []);

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

    if (editHasDeadline && editSelectedDate) {
      const [year, month, day] = editSelectedDate.split('-').map(Number);
      if (editHasTimeLimit && editDueTimeString) {
        const [hours, minutes] = editDueTimeString.split(':').map(Number);
        finalDueDate = new Date(year, month - 1, day, hours, minutes);
      } else {
        finalDueDate = new Date(year, month - 1, day, 23, 59);
      }
    }

    // Si hay recordatorio, programar notificación
    if (editHasReminder && finalDueDate && editSelectedReminder) {
      finalReminder = editSelectedReminder;
      const reminderTime = calculateReminderTime(finalDueDate, editSelectedReminder);

      // Programar notificación para el momento exacto
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '¡Recordatorio de Tarea!',
          body: `La tarea "${editTitle}" vence ${finalReminder.label}`,
          sound: 'default',
          data: { taskId: task.id },
        },
        trigger: { date: reminderTime },
      });
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

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <>
      <View style={[styles.container, task.completed && styles.completedContainer, isOverdue && styles.overdueContainer]}>
        <AccessibleButton
          style={styles.checkButton}
          onPress={async () => {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: task.completed ? 'Tarea Pendiente' : 'Tarea Completada',
                body: task.completed
                  ? `La tarea "${task.title}" ha sido marcada como pendiente`
                  : `¡Felicidades! Has completado la tarea "${task.title}"`,
                sound: 'default',
              },
              trigger: null,
            });
            onToggle(task.id);
          }}
        >
          {task.completed ? (
            <CheckCircle size={24} color="#4CAF50" />
          ) : (
            <Circle size={24} color="#757575" />
          )}
        </AccessibleButton>
        {/* ... resto de tu UI igual ... */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' },
  completedContainer: { backgroundColor: '#F8F9FA' },
  overdueContainer: { backgroundColor: '#FFEBEE' },
  checkButton: { padding: 8, marginRight: 12 },
});
