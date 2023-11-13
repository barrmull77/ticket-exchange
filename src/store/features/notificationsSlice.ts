import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getNotifications } from '../../api/api';

const initialState: any = {
    notifications: null,
    error: []
};

export const fetchNotifications = createAsyncThunk('skills/fetchNotifications', async (id: string | number) => {
    const notifications = await getNotifications(id);
    const notificationsArray = notifications['hydra:member'];
    return { notifications : notificationsArray };
});

export const skillsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload.notifications;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default skillsSlice.reducer;
