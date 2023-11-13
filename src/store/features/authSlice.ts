import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLoginToken } from '../../api/api';
import userProfile from '../../dummyData/userProfile.json'

const initialState: any = {
    isLoggedIn: false,
    error: [],
    user: null,
    // Flag to Demonstrate Frontend App alone without backend apis when set to true
    isDemoApp: true,
};

export const fetchLoginToken = createAsyncThunk('user/fetchLoginToken', async (msAccessToken: string, { rejectWithValue }) => {
    try {
        const response = await getLoginToken(msAccessToken) || '';

        if (response?.data) {
            localStorage.setItem("bmpUser", JSON.stringify(response.data));
        }

        return { user: response?.data };
    } catch (error: any) {
        return rejectWithValue(error);;
    }
});

// For demonstration a dummy access token is fetched
export const fetchDummyLoginToken = createAsyncThunk('user/fetchDummyLoginToken', async () => {
    const userProfile = {
                displayName: 'Joey',
                givenName: 'Joe',
                jobTitle: 'Web developer',
                mail: 'joesmith@smith.com',
                officeLocation: 'berlin',
                preferredLanguage: 'english',
                surname: 'Smith',
                userPrincipalName: 'joe7',
                id: '1',
            }
    
    localStorage.setItem("bmpUser", JSON.stringify(userProfile));
    
    return { user: userProfile };
});

export const logOut = createAsyncThunk("auth/logout", async () => {
    return { }
});

export const setDemoApp = createAsyncThunk("auth/setdemoap", async () => {
    return { }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoginToken.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.userProfile = action.payload.user;
            })
            .addCase(fetchLoginToken.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.error.push(action.payload);
            })
            .addCase(logOut.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.userProfile = null;
            })
            .addCase(fetchDummyLoginToken.fulfilled,(state, action) => {
                state.isLoggedIn = true;
                state.userProfile = action.payload.user;
            })
    },
});

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;
