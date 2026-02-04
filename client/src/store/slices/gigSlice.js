import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchGigs = createAsyncThunk('gigs/fetchAll', async (search, { rejectWithValue }) => {
    try {
        const response = await api.get(`/gigs${search ? `?search=${search}` : ''}`);
        // Extract data from new response format
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
});

export const createGig = createAsyncThunk('gigs/create', async (gigData, { rejectWithValue }) => {
    try {
        const response = await api.post('/gigs', gigData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
});

export const fetchMyGigs = createAsyncThunk('gigs/fetchMyGigs', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/gigs/my');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
});

// NEW: Update gig
export const updateGig = createAsyncThunk('gigs/update', async ({ id, gigData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/gigs/${id}`, gigData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
});

// NEW: Delete gig
export const deleteGig = createAsyncThunk('gigs/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/gigs/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Network error' });
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
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGigs.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs = action.payload;
            })
            .addCase(fetchGigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchMyGigs.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchMyGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.myGigs = action.payload;
            })
            .addCase(fetchMyGigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createGig.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createGig.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs.unshift(action.payload);
                state.myGigs.unshift(action.payload);
            })
            .addCase(createGig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // NEW: Update gig reducers
            .addCase(updateGig.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateGig.fulfilled, (state, action) => {
                state.loading = false;
                // Update in gigs array
                const gigIndex = state.gigs.findIndex(g => g._id === action.payload._id);
                if (gigIndex !== -1) state.gigs[gigIndex] = action.payload;
                // Update in myGigs array
                const myGigIndex = state.myGigs.findIndex(g => g._id === action.payload._id);
                if (myGigIndex !== -1) state.myGigs[myGigIndex] = action.payload;
            })
            .addCase(updateGig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // NEW: Delete gig reducers
            .addCase(deleteGig.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteGig.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs = state.gigs.filter(g => g._id !== action.payload);
                state.myGigs = state.myGigs.filter(g => g._id !== action.payload);
            })
            .addCase(deleteGig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = gigSlice.actions;
export default gigSlice.reducer;
