import { configureStore, combineReducers,  getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './features/authSlice';
import taskReducer from './features/taskSlice';
import skillsReducer from './features/skillsSlice';
import projectsReducer from './features/projectsSlice';
import notificationsReducer from './features/notificationsSlice';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
    auth: authReducer,
    task: taskReducer,
    skills: skillsReducer,
    projects: projectsReducer,
    notifications: notificationsReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
export const persistor = persistStore(store)
