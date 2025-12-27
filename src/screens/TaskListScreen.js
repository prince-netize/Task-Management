/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TaskCard from '../components/TaskCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import { loadTasks, saveTasks } from '../utils/storage';
import { getFilteredAndSortedTasks, getTaskStats } from '../utils/helpers';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchText, filterStatus, filterPriority, sortBy]);

  const loadData = async () => {
    setLoading(true);
    const loadedTasks = await loadTasks();
    setTasks(loadedTasks);
    const newStats = getTaskStats(loadedTasks);
    setStats(newStats);
    setLoading(false);
  };

  const filterAndSortTasks = () => {
    const filtered = getFilteredAndSortedTasks(
      tasks,
      searchText,
      filterStatus,
      filterPriority,
      sortBy,
    );
    setFilteredTasks(filtered);
  };

  const handleSaveTasks = async updatedTasks => {
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
    filterAndSortTasks();
  };

  const deleteTask = id => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedTasks = tasks.filter(task => task.id !== id);
          await handleSaveTasks(updatedTasks);
        },
      },
    ]);
  };

  const toggleTaskCompletion = async id => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    await handleSaveTasks(updatedTasks);
  };

  const clearFilters = () => {
    setSearchText('');
    setFilterStatus('all');
    setFilterPriority('all');
    setSortBy('date');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <Text style={styles.taskCount}>
          {stats.total} total • {stats.completed} completed
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('TaskForm')}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4dabf7" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <View style={styles.content}>
        <View style={{ marginBottom: 10 }}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onClear={() => setSearchText('')}
          />
        </View>

        <FilterPanel
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {filteredTasks.length > 0 ? (
          <FlatList
            data={filteredTasks}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onToggle={toggleTaskCompletion}
                onEdit={() => navigation.navigate('TaskForm', { task: item })}
                onDelete={deleteTask}
              />
            )}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="search-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptyText}>
              {searchText || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try changing your search or filters'
                : 'Start by adding your first task'}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                if (
                  searchText ||
                  filterStatus !== 'all' ||
                  filterPriority !== 'all'
                ) {
                  clearFilters();
                } else {
                  navigation.navigate('TaskForm');
                }
              }}
            >
              <Text style={styles.emptyButtonText}>
                {searchText ||
                filterStatus !== 'all' ||
                filterPriority !== 'all'
                  ? 'Clear Filters'
                  : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4dabf7',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4dabf7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#4dabf7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskListScreen;
