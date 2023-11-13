import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSkills, setSkills } from '../../api/api';
import SkillsJSON from '../../dummyData/skills.json';

const initialState: any = {
    skills: null,
    error: []
};

export const fetchSkills = createAsyncThunk('skills/fetchSkills', async () => {
    const skills = await getSkills();
    const skillsArray = skills['hydra:member'];
    return { skills : skillsArray };
});

export const fetchDummySkills = createAsyncThunk('skills/fetchDummySkills', async () => {
    const skillsArray = SkillsJSON;
    return { skills : skillsArray || [] };
});

export const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.skills = action.payload.skills;
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchDummySkills.fulfilled, (state, action) => {
                state.skills = action.payload.skills;
            })
    },
});

export default skillsSlice.reducer;
