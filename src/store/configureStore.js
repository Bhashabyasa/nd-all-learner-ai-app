import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { watcherSaga } from './sagas/rootSaga';
import userReducer from './slices/user.slice';
import snackbarReducer from './slices/snackbar.slice';

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
    user: userReducer,
    snackbar: snackbarReducer,
});

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});
sagaMiddleware.run(watcherSaga);

export default store;
