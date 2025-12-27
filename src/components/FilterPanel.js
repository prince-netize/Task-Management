import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FilterPanel = ({
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy,
}) => {
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.sectionTitle}>Fi lters</Text>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Status</Text>
        <View style={styles.filterButtons}>
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
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Priority</Text>
        <View style={styles.filterButtons}>
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
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Sort By</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              sortBy === 'date' && styles.filterButtonActive,
            ]}
            onPress={() => setSortBy('date')}
          >
            <Icon
              name="calendar-outline"
              size={16}
              color={sortBy === 'date' ? '#fff' : '#666'}
              style={styles.filterIcon}
            />
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
            <Icon
              name="flag-outline"
              size={16}
              color={sortBy === 'priority' ? '#fff' : '#666'}
              style={styles.filterIcon}
            />
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterButtonActive: {
    backgroundColor: '#4dabf7',
    borderColor: '#4dabf7',
  },
  filterIcon: {
    marginRight: 4,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FilterPanel;
