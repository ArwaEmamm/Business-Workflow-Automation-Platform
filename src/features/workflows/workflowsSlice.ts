import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Workflow, WorkflowFormData } from '../../types/workflow.types';
import { workflowsApi } from './workflowsAPI';

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WorkflowState = {
  workflows: [],
  currentWorkflow: null,
  status: 'idle',
  error: null
};

export const fetchWorkflows = createAsyncThunk(
  'workflows/fetchWorkflows',
  async () => {
    const response = await workflowsApi.getAll();
    return response;
  }
);

export const createWorkflow = createAsyncThunk(
  'workflows/createWorkflow',
  async (workflow: WorkflowFormData) => {
    const response = await workflowsApi.create(workflow);
    return response;
  }
);

export const updateWorkflow = createAsyncThunk(
  'workflows/updateWorkflow',
  async ({ id, workflow }: { id: string; workflow: WorkflowFormData }) => {
    const response = await workflowsApi.update(id, workflow);
    return response;
  }
);

export const deleteWorkflow = createAsyncThunk(
  'workflows/deleteWorkflow',
  async (id: string) => {
    await workflowsApi.delete(id);
    return id;
  }
);

export const fetchWorkflowById = createAsyncThunk(
  'workflows/fetchWorkflowById',
  async (id: string) => {
    const response = await workflowsApi.getById(id);
    return response;
  }
);

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflows.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkflows.fulfilled, (state, action: PayloadAction<Workflow[]>) => {
        state.status = 'succeeded';
        state.workflows = Array.isArray(action.payload) ? action.payload : (action.payload?.data || action.payload?.workflows || []);
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch workflows';
      })
      .addCase(createWorkflow.fulfilled, (state, action: PayloadAction<Workflow>) => {
        state.workflows.push(action.payload);
      })
      .addCase(updateWorkflow.fulfilled, (state, action: PayloadAction<Workflow>) => {
        const index = state.workflows.findIndex(w => w.id === action.payload.id);
        if (index !== -1) {
          state.workflows[index] = action.payload;
        }
      })
      .addCase(deleteWorkflow.fulfilled, (state, action: PayloadAction<string>) => {
        state.workflows = state.workflows.filter(w => w.id !== action.payload);
      })
      .addCase(fetchWorkflowById.fulfilled, (state, action: PayloadAction<Workflow>) => {
        state.currentWorkflow = action.payload;
      });
  }
});

export default workflowsSlice.reducer;