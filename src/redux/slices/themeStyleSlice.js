import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    themeStyle: null,
    isPending: false,
    isError: false,
}

export const themeStyleSlice = createSlice({
    name: 'themeStyle',
    initialState,
    reducers: {
        setPending: (state) => {
            state.isPending = true;
            state.isError = false;
        },
        themeStyleSuccess: (state, action) => {
            state.themeStyle = action.payload;
            state.isPending = false;
            state.isError = false;
            
        },
        setError: (state) => {
            state.isError = true;
            state.isPending = false;
        },
    },
})

export const { setPending, themeStyleSuccess, setError } = themeStyleSlice.actions

export default themeStyleSlice.reducer;