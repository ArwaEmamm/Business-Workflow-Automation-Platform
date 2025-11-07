import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Request, RequestFormData, RequestFilters, ApproveRequestData } from '../../types/request.types';
import { requestsApi } from './requestsAPI';

interface RequestsState {
  requests: Request[];
  currentRequest: Request | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: RequestFilters;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: RequestsState = {
  requests: [],
  currentRequest: null,
  status: 'idle',
  error: null,
  filters: {},
  total: 0,
  page: 1,
  pageSize: 10
};

export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (filters: RequestFilters = {}) => {
    const response = await requestsApi.getAll(filters);
    return response;
  }
);

export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (request: RequestFormData) => {
    const response = await requestsApi.create(request);
    return response;
  }
);

export const fetchRequestById = createAsyncThunk(
  'requests/fetchRequestById',
  async (id: string) => {
    const response = await requestsApi.getById(id);
    return response;
  }
);

export const approveRequest = createAsyncThunk(
  'requests/approveRequest',
  async ({ id, data }: { id: string; data: ApproveRequestData }) => {
    const response = await requestsApi.approve(id, data);
    return response;
  }
);

export const forceApproveRequest = createAsyncThunk(
  'requests/forceApproveRequest',
  async (id: string) => {
    const response = await requestsApi.forceApprove(id);
    return response;
  }
);

export const forceRejectRequest = createAsyncThunk(
  'requests/forceRejectRequest',
  async (id: string) => {
    const response = await requestsApi.forceReject(id);
    return response;
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<RequestFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequests.fulfilled, (state, action: PayloadAction<{ requests: Request[]; total: number }>) => {
        state.status = 'succeeded';
        state.requests = action.payload.requests;
        state.total = action.payload.total;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch requests';
      })
      .addCase(createRequest.fulfilled, (state, action: PayloadAction<Request>) => {
        state.requests.unshift(action.payload);
      })
      .addCase(fetchRequestById.fulfilled, (state, action: PayloadAction<Request>) => {
        state.currentRequest = action.payload;
      })
      .addCase(approveRequest.fulfilled, (state, action: PayloadAction<Request>) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(forceApproveRequest.fulfilled, (state, action: PayloadAction<Request>) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(forceRejectRequest.fulfilled, (state, action: PayloadAction<Request>) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      });
  }
});

export const { setFilters, clearFilters, setPage, setPageSize } = requestsSlice.actions;
export default requestsSlice.reducer;
