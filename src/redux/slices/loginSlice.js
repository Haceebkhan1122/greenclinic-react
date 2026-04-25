import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isPending : false,
    isError : false,
}

export const userAuthSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setPending: (state) => {
            state.isPending = true;
            state.isError = false;
        },
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isPending = false;
            state.isError = false;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.isPending = false;
            state.isError = false;
        },
        setError: (state) => {
            state.isError = true;
            state.isPending = false;
        },
    },
})

export const { setPending, loginSuccess, setError, logoutSuccess } = userAuthSlice.actions

export default userAuthSlice.reducer;