import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userAuthSlice } from '../slices/loginSlice'
import { themeStyleSlice } from '../slices/themeStyleSlice'
import ClinicReducer from '../slices/clinicSlice';
import UserDetails from '../slices/userDetailsSlice';
import PrescriptionReducer from '../slices/prescSlice';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import updateProfileSlice from '../slices/updateProfileSlice'

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  user: userAuthSlice.reducer,
  themeStyle: themeStyleSlice.reducer,
  clinic: ClinicReducer,
  prescription : PrescriptionReducer,
  userProfile: updateProfileSlice,
  UserDetail: UserDetails,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


let store = configureStore({
  reducer: persistedReducer,
})


let persistor = persistStore(store)

export { store, persistor };