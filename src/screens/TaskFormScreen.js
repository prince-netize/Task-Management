/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { generateId, getPriorityColor } from '../utils/helpers';
import { loadTasks, saveTasks } from '../utils/storage';

const TaskFormScreen = ({ navigation, route }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadData();
    if (route.params?.task) {
      setEditingTask(route.params.task);
      setTaskTitle(route.params.task.title);
      setTaskDescription(route.params.task.description);
      setPriority(route.params.task.priority);
    }
  }, [route.params]);

  const loadData = async () => {
    const loadedTasks = await loadTasks();
    setTasks(loadedTasks);
  };

  const isDuplicateTitle = (title, excludeId = null) => {
    return tasks.some(
      task =>
        task.title.toLowerCase() === title.toLowerCase() &&
        task.id !== excludeId,
    );
  };

  const handleSubmit = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    if (isDuplicateTitle(taskTitle, editingTask?.id)) {
      Alert.alert('Error', 'A task with this title already exists');
      return;
    }

    try {
      if (editingTask) {
        const updatedTasks = tasks.map(task =>
          task.id === editingTask.id
            ? {
                ...task,
                title: taskTitle.trim(),
                description: taskDescription.trim(),
                priority: priority,
              }
            : task,
        );
        await saveTasks(updatedTasks);
        Alert.alert('Success', 'Task updated successfully');
      } else {
        const newTask = {
          id: generateId(),
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          priority: priority,
          completed: false,
          createdAt: new Date(),
        };
        const updatedTasks = [newTask, ...tasks];
        await saveTasks(updatedTasks);
        Alert.alert('Success', 'Task added successfully');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
    }
  };
  const handleDelete = () => {
    if (!editingTask) return;

    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'desructive',
        onPress: async () => {
          const updateTasks = tasks.filter(task => task.id !== editingTask.id);
          await saveTasks(updateTasks);
          Alert.alert('Success', 'Task deleted Successfully');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Title <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholderTextColor="#999"
                autoFocus={!editingTask}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter task description"
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline
                numberOfLines={6}
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {['low', 'medium', 'high'].map(pri => {
                  const isActive = priority === pri;
                  const color = getPriorityColor(pri);
                  return (
                    <TouchableOpacity
                      key={pri}
                      style={[
                        styles.priorityOption,
                        isActive && {
                          backgroundColor: color,
                          borderColor: color,
                        },
                      ]}
                      onPress={() => setPriority(pri)}
                    >
                      <Icon
                        name="flag-outline"
                        size={16}
                        color={isActive ? '#fff' : '#666'}
                        style={styles.priorityIcon}
                      />
                      <Text
                        style={[
                          styles.priorityOptionText,
                          isActive && styles.priorityOptionTextActive,
                        ]}
                      >
                        {pri.charAt(0).toUpperCase() + pri.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>
              {editingTask ? 'Update Task' : 'Save Task'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#ff6b6b',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    color: '#333',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  priorityIcon: {
    marginRight: 4,
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
  priorityLegend: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
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

export default TaskFormScreen;
