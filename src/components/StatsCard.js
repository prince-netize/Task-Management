import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getPriorityColor } from '../utils/helpers';

const StatItem = ({ label, value, color, icon }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const StatsCard = ({ stats, onRefresh }) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Overview</Text>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Icon name="refresh-outline" size={20} color="#4dabf7" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsGrid}>
        <StatItem
          label="Total"
          value={stats.total}
          color="#4dabf7"
          icon="list-outline"
        />
        <StatItem
          label="Completed"
          value={stats.completed}
          color="#6bcf7f"
          icon="checkmark-done-outline"
        />
        <StatItem
          label="High"
          value={stats.high}
          color={getPriorityColor('high')}
          icon="flag-outline"
        />
        <StatItem
          label="Medium"
          value={stats.medium}
          color={getPriorityColor('medium')}
          icon="flag-outline"
        />
        <StatItem
          label="Low"
          value={stats.low}
          color={getPriorityColor('low')}
          icon="flag-outline"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  refreshButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  completionContainer: {
    alignItems: 'center',
  },
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4dabf7',
    marginBottom: 4,
  },
  completionLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default StatsCard;
