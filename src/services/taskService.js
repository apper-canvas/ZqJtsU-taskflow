import { getApperClient } from './apperClient';

// Table name for tasks
const TABLE_NAME = 'task2';

// Get all tasks
export const fetchTasks = async () => {
  try {
    const apperClient = getApperClient();
    
    if (!apperClient) {
      throw new Error('Apper client is not initialized');
    }
    
    const params = {
      fields: [
        'Id', 'Name', 'title', 'description', 'priority', 'status', 'created_at',
        'CreatedOn', 'ModifiedOn'
      ],
      pagingInfo: { limit: 100, offset: 0 },
      orderBy: [{ field: 'CreatedOn', direction: 'desc' }]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    if (!apperClient) {
      throw new Error('Apper client is not initialized');
    }
    
    // Map form data to Apper fields
    const record = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      created_at: new Date().toISOString()
    };
    
    const params = { record };
    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    const apperClient = getApperClient();
    
    if (!apperClient) {
      throw new Error('Apper client is not initialized');
    }
    
    // Only update the provided fields
    const record = { ...taskData };
    
    const params = { record };
    const response = await apperClient.updateRecord(TABLE_NAME, taskId, params);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const apperClient = getApperClient();
    
    if (!apperClient) {
      throw new Error('Apper client is not initialized');
    }
    
    await apperClient.deleteRecord(TABLE_NAME, taskId);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};