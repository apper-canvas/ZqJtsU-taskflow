import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask as removeTask 
} from '../services/taskService';

// Async thunks for task operations
export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTasks();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await createTask(taskData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await updateTask(id, { status });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeTaskById = createAsyncThunk(
  'tasks/removeTask',
  async (id, { rejectWithValue }) => {
    try {
      await removeTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  tasks: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filter: 'all', // 'all' | 'active' | 'completed'
  sortOrder: 'desc', // 'asc' | 'desc'
};

// Create the tasks slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAllTasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle addTask
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Handle updateTaskStatus
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.Id === action.payload.Id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Handle removeTaskById
      .addCase(removeTaskById.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.Id !== action.payload);
      });
  },
});

// Export actions and reducer
export const { setFilter, setSortOrder, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;

// Selectors
export const selectAllTasks = (state) => state.tasks.tasks;
export const selectTasksStatus = (state) => state.tasks.status;
export const selectTasksError = (state) => state.tasks.error;
export const selectFilter = (state) => state.tasks.filter;
export const selectSortOrder = (state) => state.tasks.sortOrder;

export const selectFilteredTasks = (state) => {
  const filter = state.tasks.filter;
  const tasks = state.tasks.tasks;
  
  if (filter === 'all') return tasks;
  if (filter === 'active') return tasks.filter(task => task.status !== 'completed');
  if (filter === 'completed') return tasks.filter(task => task.status === 'completed');
  return tasks;
};

export const selectSortedFilteredTasks = (state) => {
  const filteredTasks = selectFilteredTasks(state);
  const sortOrder = state.tasks.sortOrder;
  
  return [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.created_at || a.CreatedOn);
    const dateB = new Date(b.created_at || b.CreatedOn);
    
    return sortOrder === 'asc' 
      ? dateA - dateB 
      : dateB - dateA;
  });
};