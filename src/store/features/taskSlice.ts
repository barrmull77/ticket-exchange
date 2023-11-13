import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTask, getTasks, getDummyTasks, createTasks } from '../../api/api';
import TasksJSON from '../../dummyData/tasks.json';
import { TaskSharp } from '@mui/icons-material';

const initialState: any = {
    selectedTask: null,
    tasks: null,
    myTasks: null,
    appliedTasks: null,
    isLoading: false,
    error: []
};

export const fetchTask = createAsyncThunk('task/fetchTask', async (id: string | number) => {
    const task = await getTask(id);
    return { selectedTask : task };
});

export const fetchDummyTask = createAsyncThunk('task/fetchDummyTask', async (id: string | number) => {
    const tasksArray = TasksJSON;
    const selectedTask = tasksArray.find(item => Number(item.id) === id);
    
    return { selectedTask };
});

export const fetchTasks = createAsyncThunk('task/fetchTasks', async (queryStr : string = '?order%5BcreatedAt%5D=desc') => {

    const tasks = await getTasks(queryStr);
    const tasksArray = tasks['hydra:member'];
    return { tasks : tasksArray };
});

export const fetchDummyTasks = createAsyncThunk('task/fetchDummyTasks', async () => {
    const tasksArray = TasksJSON;
    return { tasks : tasksArray };
});

export const fetchMyTasks = createAsyncThunk('task/fetchMyTasks', async (id: string) => {
    const queryStr = `?owner.id=${id}&ordercreatedAt=desc`;
    const tasks = await getTasks(queryStr);
    const tasksArray = tasks['hydra:member'];
    return { myTasks : tasksArray };
});

export const fetchMyDummyTasks = createAsyncThunk('task/fetchMyDummyTasks', async (id: string) => {
    const tasksArray = TasksJSON;
    const filterMyTasks = tasksArray.filter(Task => Task.owner.id === Number(id));
   
    return { myTasks : filterMyTasks };
});

export const fetchAppliedTasks = createAsyncThunk('task/fetchAppliedTasks', async (id : string) => {
    const queryStr = `?requests.user.id=${id}`
    const tasks = await getTasks(queryStr);
    const tasksArray = tasks['hydra:member'];
    return { appliedTasks : tasksArray };
});

export const fetchDummyAppliedTasks = createAsyncThunk('task/fetchDummyAppliedTasks', async (id : string) => {
    const tasksArray = TasksJSON;
    const filterMyTasks = tasksArray.filter(task => {
        return task.requests.some(request => request.user.id === Number(id));
    });
    return { appliedTasks : filterMyTasks };
});

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTask.fulfilled, (state, action) => {
                state.selectedTask = action.payload.selectedTask;
            })
            .addCase(fetchTask.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchDummyTask.fulfilled, (state, action) => {
                state.selectedTask = action.payload.selectedTask;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload.tasks;
            })
            .addCase(fetchTasks.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchDummyTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload.tasks;
            })
            .addCase(fetchMyTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myTasks = action.payload.myTasks;
            })
            .addCase(fetchMyTasks.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchMyTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyDummyTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myTasks = action.payload.myTasks;
            })
            .addCase(fetchAppliedTasks.fulfilled, (state, action) => {
                state.appliedTasks = action.payload.appliedTasks;
            })
            .addCase(fetchAppliedTasks.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchDummyAppliedTasks.fulfilled, (state, action) => {
                state.appliedTasks = action.payload.appliedTasks;
            })
    },
});

export default taskSlice.reducer;
