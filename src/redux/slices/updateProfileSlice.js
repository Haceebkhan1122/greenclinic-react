import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userProfile: {},
}

export const updateProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        profileSuccess: (state, action) => {
            state.userProfile = action.payload;
        }
    }
})

export const { profileSuccess } = updateProfileSlice.actions

export default updateProfileSlice.reducer;