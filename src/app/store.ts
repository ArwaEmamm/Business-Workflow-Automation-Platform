import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import workflowsReducer from '../features/workflows/workflowsSlice'
import requestsReducer from '../features/requests/requestsSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workflows: workflowsReducer,
    requests: requestsReducer,
    notifications: notificationsReducer,
  },
})

// أنواع عامة مفيدة للـ dispatch و useSelector
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
