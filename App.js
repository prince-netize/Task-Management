/* eslint-disable react-native/no-inline-styles */
// App.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingTask, setEditingTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        const parsedTasks = JSON.parse(storedTasks);
        const tasksWithDates = parsedTasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const generateId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  const isDuplicateTitle = (title, excludeId = null) => {
    return tasks.some(
      task =>
        task.title.toLowerCase() === title.toLowerCase() &&
        task.id !== excludeId,
    );
  };

  const addTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    if (isDuplicateTitle(taskTitle)) {
      Alert.alert('Error', 'A task with this title already exists');
      return;
    }

    const newTask = {
      id: generateId(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      priority: priority,
      completed: false,
      createdAt: new Date(),
    };
    console.log(newTask, '++++++++++');

    setTasks(prevTasks => [newTask, ...prevTasks]);
    resetForm();
  };
  const updateTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    if (isDuplicateTitle(taskTitle, editingTask.id)) {
      Alert.alert('Error', 'A task with this title already exists');
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editingTask.id
          ? {
              ...task,
              title: taskTitle.trim(),
              description: taskDescription.trim(),
              priority: priority,
            }
          : task,
      ),
    );

    resetForm();
  };
  const deleteTask = id => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        },
      },
    ]);
  };

  const toggleTaskCompletion = id => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const startEditing = task => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setPriority(task.priority);
    setModalVisible(true);
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setPriority('medium');
    setEditingTask(null);
    setModalVisible(false);
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks;

    if (searchText) {
      filteredTasks = filteredTasks.filter(
        task =>
          task.title.toLowerCase().includes(searchText.toLowerCase()) ||
          task.description.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (filterStatus === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (filterStatus === 'pending') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter(
        task => task.priority === filterPriority,
      );
    }

    if (sortBy === 'date') {
      filteredTasks = filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filteredTasks = filteredTasks.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority],
      );
    }

    return filteredTasks;
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#ff6b6b';
      case 'medium':
        return '#ffd93d';
      case 'low':
        return '#6bcf7f';
      default:
        return '#6c757d';
    }
  };

  const getTaskStats = () => {
    return tasks.reduce(
      (stats, task) => {
        stats.total++;
        if (task.completed) stats.completed++;
        if (task.priority === 'high') stats.high++;
        if (task.priority === 'medium') stats.medium++;
        if (task.priority === 'low') stats.low++;
        return stats;
      },
      { total: 0, completed: 0, high: 0, medium: 0, low: 0 },
    );
  };

  const stats = getTaskStats();
  const filteredTasks = getFilteredAndSortedTasks();

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleContainer}>
          <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
            <View
              style={[
                styles.checkbox,
                item.completed && styles.checkboxChecked,
              ]}
            >
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          <Text
            style={[styles.taskTitle, item.completed && styles.taskCompleted]}
          >
            {item.title}
          </Text>
        </View>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        >
          <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
        </View>
      </View>

      {item.description ? (
        <Text style={styles.taskDescription}>{item.description}</Text>
      ) : null}

      <Text style={styles.taskDate}>
        Created: {item.createdAt.toLocaleDateString()}{' '}
        {item.createdAt.toLocaleTimeString()}
      </Text>

      <View style={styles.taskActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => startEditing(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteTask(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Task Manager</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#ff6b6b' }]}>
              {stats.high}
            </Text>
            <Text style={styles.statLabel}>High</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#ffd93d' }]}>
              {stats.medium}
            </Text>
            <Text style={styles.statLabel}>Medium</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#6bcf7f' }]}>
              {stats.low}
            </Text>
            <Text style={styles.statLabel}>Low</Text>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status:</Text>
            {['all', 'pending', 'completed'].map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.filterButtonActive,
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === status && styles.filterButtonTextActive,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Priority:</Text>
            {['all', 'low', 'medium', 'high'].map(pri => (
              <TouchableOpacity
                key={pri}
                style={[
                  styles.filterButton,
                  filterPriority === pri && styles.filterButtonActive,
                ]}
                onPress={() => setFilterPriority(pri)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterPriority === pri && styles.filterButtonTextActive,
                  ]}
                >
                  {pri.charAt(0).toUpperCase() + pri.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <TouchableOpacity
              style={[
                styles.filterButton,
                sortBy === 'date' && styles.filterButtonActive,
              ]}
              onPress={() => setSortBy('date')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  sortBy === 'date' && styles.filterButtonTextActive,
                ]}
              >
                Date
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                sortBy === 'priority' && styles.filterButtonActive,
              ]}
              onPress={() => setSortBy('priority')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  sortBy === 'priority' && styles.filterButtonTextActive,
                ]}
              >
                Priority
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Task List */}
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks found</Text>
            </View>
          }
        />
      </ScrollView>

      {/* Add/Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Task Title *"
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholderTextColor="#999"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />

            <Text style={styles.priorityLabel}>Priority:</Text>
            <View style={styles.priorityContainer}>
              {['low', 'medium', 'high'].map(pri => (
                <TouchableOpacity
                  key={pri}
                  style={[
                    styles.priorityOption,
                    priority === pri && {
                      backgroundColor: getPriorityColor(pri),
                    },
                  ]}
                  onPress={() => setPriority(pri)}
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      priority === pri && styles.priorityOptionTextActive,
                    ]}
                  >
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={editingTask ? updateTask : addTask}
              >
                <Text style={styles.saveButtonText}>
                  {editingTask ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Task Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecececff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
    width: 60,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#4dabf7',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4dabf7',
    borderColor: '#4dabf7',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#e7f5ff',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButtonText: {
    color: '#4dabf7',
  },
  deleteButtonText: {
    color: '#ff6b6b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4dabf7',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  priorityOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  priorityOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
  },
  saveButton: {
    backgroundColor: '#4dabf7',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
