import  { React, createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TaskReminder {
  id: string;
  type: 'preset' | 'custom';
  value: string; // '1_day', '1_hour', or custom like '30_minutes'
  label: string; // '1 día antes', '1 hora antes', '30 minutos antes'
  timestamp?: number; // Calculated reminder time
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

interface TasksContextType {
  tasks: Task[];
  addTask: (title: string, description: string, dueDate?: Date, reminder?: TaskReminder) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  isLoading: boolean;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksData = await AsyncStorage.getItem('tasks');
      if (tasksData) {
        const parsedTasks = JSON.parse(tasksData);
        // Convert createdAt strings back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error('Error Cargando Tareas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error Guardando Tareas:', error);
    }
  };

  const addTask = async (title: string, description: string, dueDate?: Date, reminder?: TaskReminder) => {
    let processedReminder = reminder;
    
    // Calculate reminder timestamp if reminder is provided
    if (dueDate && reminder) {
      const dueDateTimestamp = dueDate.getTime();
      let reminderTime = dueDateTimestamp;
      
      switch (reminder.value) {
        case '1_day':
          reminderTime = dueDateTimestamp - (24 * 60 * 60 * 1000);
          break;
        case '1_hour':
          reminderTime = dueDateTimestamp - (60 * 60 * 1000);
          break;
        default:
          // Handle custom reminders (format: "30_minutes", "3_days", etc.)
          const [amount, unit] = reminder.value.split('_');
          const multiplier = {
            minutes: 60 * 1000,
            hours: 60 * 60 * 1000,
            days: 24 * 60 * 60 * 1000,
          }[unit] || 60 * 1000;
          reminderTime = dueDateTimestamp - (parseInt(amount) * multiplier);
          break;
      }
      
      processedReminder = {
        ...reminder,
        timestamp: reminderTime,
      };
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      dueDate,
      hasReminder: !!reminder,
      reminder: processedReminder,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates };
        
        // Recalculate reminder timestamp if dueDate or reminder changed
        if (updates.dueDate || updates.reminder) {
          const dueDate = updates.dueDate || task.dueDate;
          const reminder = updates.reminder || task.reminder;
          
          if (dueDate && reminder) {
            const dueDateTimestamp = dueDate.getTime();
            let reminderTime = dueDateTimestamp;
            
            switch (reminder.value) {
              case '1_day':
                reminderTime = dueDateTimestamp - (24 * 60 * 60 * 1000);
                break;
              case '1_hour':
                reminderTime = dueDateTimestamp - (60 * 60 * 1000);
                break;
              default:
                const [amount, unit] = reminder.value.split('_');
                const multiplier = {
                  minutes: 60 * 1000,
                  hours: 60 * 60 * 1000,
                  days: 24 * 60 * 60 * 1000,
                }[unit] || 60 * 1000;
                reminderTime = dueDateTimestamp - (parseInt(amount) * multiplier);
                break;
            }
            
            updatedTask.reminder = {
              ...reminder,
              timestamp: reminderTime,
            };
          }
        }
        
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const toggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const deleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, toggleTask, deleteTask, isLoading }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};