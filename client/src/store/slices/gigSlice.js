import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchGigs = createAsyncThunk('gigs/fetchAll', async (search, { rejectWithValue }) => {
    try {
        const response = await api.get(`/gigs${search ? `?search=${search}` : ''}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const createGig = createAsyncThunk('gigs/create', async (gigData, { rejectWithValue }) => {
    try {
        const response = await api.post('/gigs', gigData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const fetchMyGigs = createAsyncThunk('gigs/fetchMyGigs', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/gigs/my');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const gigSlice = createSlice({
    name: 'gigs',
    initialState: {
        gigs: [],
        myGigs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGigs.pending, (state) => { state.loading = true; })
            .addCase(fetchGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs = action.payload;
            })
            .addCase(fetchGigs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchMyGigs.pending, (state) => { state.loading = true; })
            .addCase(fetchMyGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.myGigs = action.payload;
            })
            .addCase(fetchMyGigs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(createGig.pending, (state) => { state.loading = true; })
            .addCase(createGig.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs.unshift(action.payload);
                state.myGigs.unshift(action.payload);
            })
            .addCase(createGig.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export default gigSlice.reducer;
