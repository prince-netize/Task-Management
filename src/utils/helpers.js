export const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

export const getPriorityColor = priority => {
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

export const getFilteredAndSortedTasks = (
  tasks,
  searchText,
  filterStatus,
  filterPriority,
  sortBy,
) => {
  let filteredTasks = [...tasks];

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
  } else if (sortBy === 'title') {
    filteredTasks = filteredTasks.sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }

  return filteredTasks;
};

export const getTaskStats = tasks => {
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

export const formatDate = date => {
  const today = new Date();
  const taskDate = new Date(date);

  if (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  ) {
    return 'Today';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (
    taskDate.getDate() === yesterday.getDate() &&
    taskDate.getMonth() === yesterday.getMonth() &&
    taskDate.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }

  return taskDate.toLocaleDateString();
};
