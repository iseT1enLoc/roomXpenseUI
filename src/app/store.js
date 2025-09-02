// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import authReducer from './authSlice';
// import expenseReducer from './expenseSlice';
// import userReducer from './userSlice';
// import { combineReducers } from 'redux';
// // Kết hợp các reducers
// const rootReducer = combineReducers({
//   auth: authReducer,
//   expense: expenseReducer,
//   user:userReducer
// });

// // Cấu hình redux-persist
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth']
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Tạo store với configureStore
// const store = configureStore({
//   reducer: persistedReducer,

//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // Tắt kiểm tra tuần tự hóa
//     }),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// // Tạo persistor
// const persistor = persistStore(store);

// export { store, persistor };
// store/index.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector } from "react-redux";

// Reducers
import authReducer from "./authSlice";
import expenseReducer from "./expenseSlice";
import userReducer from "./userSlice";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  expense: expenseReducer,
  user: userReducer,
});

// Redux Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist only auth
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // turn off checks for redux-persist
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor
const persistor = persistStore(store);

// Infer types automatically (if you ever switch to TS)
export const RootState = store.getState;
export const AppDispatch = store.dispatch;

// Custom hooks for React components
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export { store, persistor };
