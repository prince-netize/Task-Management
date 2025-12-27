import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadTasks = async () => {
  try {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks !== null) {
      const parsedTasks = JSON.parse(storedTasks);
      return parsedTasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = async tasks => {
  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const clearAllTasks = async () => {
  try {
    await AsyncStorage.removeItem('tasks');
    return true;
  } catch (error) {
    console.error('Error clearing tasks:', error);
    return false;
  }
};
