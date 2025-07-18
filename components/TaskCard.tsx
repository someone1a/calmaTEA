import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { CircleCheck as CheckCircle, Circle, Trash2 } from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
      ]
    );
  };

  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      <AccessibleButton
        style={styles.checkButton}
        onPress={() => onToggle(task.id)}
        accessibilityLabel={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        accessibilityHint={`Toggle completion status for ${task.title}`}
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
      </View>

      <AccessibleButton
        style={styles.deleteButton}
        onPress={handleDelete}
        accessibilityLabel="Delete task"
        accessibilityHint={`Delete the task: ${task.title}`}
      >
        <Trash2 size={20} color="#F44336" />
      </AccessibleButton>
    </View>
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
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
  },
});