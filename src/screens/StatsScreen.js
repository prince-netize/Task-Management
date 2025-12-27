/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import StatsCard from '../components/StatsCard';
import ProgressChart from '../components/ProgressChart';
import { loadTasks } from '../utils/storage';
import { getTaskStats } from '../utils/helpers';

const StatsScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedTasks = await loadTasks();
    setTasks(loadedTasks);
    const newStats = getTaskStats(loadedTasks);
    setStats(newStats);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  const completionRate =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const tasksToday = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.createdAt);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Statistics</Text>
          <Text style={styles.headerSubtitle}>Track your productivity</Text>
        </View>

        <StatsCard stats={stats} onRefresh={onRefresh} />

        <View style={styles.chartsSection}>
          {/* Completion Rate */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Icon name="checkmark-circle-outline" size={20} color="#4dabf7" />
              <Text style={styles.chartTitle}>Completion Rate</Text>
            </View>
            <ProgressChart
              percentage={completionRate}
              label="Tasks Completed"
            />
          </View>
        </View>

        {/* Daily Stats */}
        <View style={styles.dailyStatsCard}>
          <Text style={styles.sectionTitle}>Daily Performance</Text>

          <View style={styles.dailyStatsGrid}>
            <View style={styles.dailyStatItem}>
              <View
                style={[styles.dailyStatIcon, { backgroundColor: '#e7f5ff' }]}
              >
                <Icon name="today-outline" size={24} color="#4dabf7" />
              </View>
              <Text style={styles.dailyStatValue}>{tasksToday}</Text>
              <Text style={styles.dailyStatLabel}>Today</Text>
            </View>

            <View style={styles.dailyStatItem}>
              <View
                style={[styles.dailyStatIcon, { backgroundColor: '#fff5f5' }]}
              >
                <Icon name="flag-outline" size={24} color="#ff6b6b" />
              </View>
              <Text style={styles.dailyStatValue}>{stats.high}</Text>
              <Text style={styles.dailyStatLabel}>High Priority</Text>
            </View>

            <View style={styles.dailyStatItem}>
              <View
                style={[styles.dailyStatIcon, { backgroundColor: '#e7f8f0' }]}
              >
                <Icon name="checkmark-done-outline" size={24} color="#6bcf7f" />
              </View>
              <Text style={styles.dailyStatValue}>{stats.completed}</Text>
              <Text style={styles.dailyStatLabel}>Completed</Text>
            </View>

            <View style={styles.dailyStatItem}>
              <View
                style={[styles.dailyStatIcon, { backgroundColor: '#fff9db' }]}
              >
                <Icon name="time-outline" size={24} color="#ffd93d" />
              </View>
              <Text style={styles.dailyStatValue}>
                {stats.total - stats.completed}
              </Text>
              <Text style={styles.dailyStatLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Summary</Text>

          <View style={styles.summaryItem}>
            <View style={styles.summaryInfo}>
              <Icon name="trophy-outline" size={20} color="#ffd93d" />
              <Text style={styles.summaryLabel}>Productivity Score</Text>
            </View>
            <Text style={styles.summaryValue}>
              {stats.total > 0
                ? Math.round(
                    ((stats.completed * 3 + (stats.total - stats.completed)) /
                      (stats.total * 3)) *
                      10,
                  )
                : 0}
              /10
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <View style={styles.summaryInfo}>
              <Icon name="trending-up-outline" size={20} color="#f34646ff" />
              <Text style={styles.summaryLabel}>Average Completion</Text>
            </View>
            <Text style={styles.summaryValue}>
              {completionRate.toFixed(1)}%
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <View style={styles.summaryInfo}>
              <Icon name="speedometer-outline" size={20} color="#6bcf7f" />
              <Text style={styles.summaryLabel}>Efficiency</Text>
            </View>
            <Text style={styles.summaryValue}>
              {stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0}
              %
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  chartsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  legendContainer: {
    marginTop: 20,
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
  dailyStatsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  dailyStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dailyStatItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  dailyStatIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dailyStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default StatsScreen;
