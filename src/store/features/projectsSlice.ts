import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProjects } from '../../api/api';

const initialState: any = {
    projects: null,
    error: []
};

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    const projects = await getProjects();
    const projectsArray = projects['hydra:member'];

    return { projects : projectsArray };
});

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.projects = action.payload.projects;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default projectsSlice.reducer;
