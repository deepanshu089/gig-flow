import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchMyBids = createAsyncThunk('bids/fetchMyBids', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/bids/my');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const placeBid = createAsyncThunk('bids/placeBid', async (bidData, { rejectWithValue }) => {
    try {
        const response = await api.post('/bids', bidData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const fetchBidsForGig = createAsyncThunk('bids/fetchForGig', async (gigId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/bids/${gigId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const hireFreelancer = createAsyncThunk('bids/hire', async (bidId, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/bids/${bidId}/hire`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});


const bidSlice = createSlice({
    name: 'bids',
    initialState: {
        myBids: [],
        gigBids: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyBids.pending, (state) => { state.loading = true; })
            .addCase(fetchMyBids.fulfilled, (state, action) => {
                state.loading = false;
                state.myBids = action.payload;
            })
            .addCase(fetchMyBids.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(placeBid.fulfilled, (state, action) => {
                state.myBids.push(action.payload);
            })
            .addCase(placeBid.rejected, (state, action) => { state.error = action.payload; })

            .addCase(fetchBidsForGig.pending, (state) => { state.loading = true; })
            .addCase(fetchBidsForGig.fulfilled, (state, action) => {
                state.loading = false;
                state.gigBids = action.payload;
            })
            .addCase(fetchBidsForGig.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(hireFreelancer.fulfilled, (state, action) => {
                state.gigBids = state.gigBids.map(bid =>
                    bid._id === action.meta.arg ? { ...bid, status: 'hired' } : { ...bid, status: 'rejected' }
                );
            });
    }
});

export default bidSlice.reducer;
