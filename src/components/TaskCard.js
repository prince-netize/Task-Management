import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getPriorityColor, formatDate } from '../utils/helpers';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const priorityColor = getPriorityColor(task.priority);

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onToggle(task.id)}
        >
          <View
            style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          >
            {task.completed && <Icon name="checkmark" size={14} color="#fff" />}
          </View>
          <Text
            style={[styles.taskTitle, task.completed && styles.taskCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
        </TouchableOpacity>

        <View
          style={[styles.priorityBadge, { backgroundColor: priorityColor }]}
        >
          <Text style={styles.priorityText}>
            {task.priority.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {task.description ? (
        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.taskFooter}>
        <View style={styles.dateContainer}>
          <Icon name="calendar-outline" size={12} color="#999" />
          <Text style={styles.taskDate}>{formatDate(task.createdAt)}</Text>
        </View>

        <View style={styles.taskActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(task)}
          >
            <Icon name="create-outline" size={16} color="#4dabf7" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(task.id)}
          >
            <Icon name="trash-outline" size={16} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  checkboxContainer: {
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
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  taskActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#e7f5ff',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
  },
});

export default TaskCard;
